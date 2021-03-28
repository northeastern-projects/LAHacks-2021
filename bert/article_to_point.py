import torch
import transformers as tr
from sklearn.manifold import MDS
from typing import List
import json


class Article:
    properties = {"title", "description", "id", "authors", "fulltextUrls"}

    def __init__(self, metadata: dict):
        self.dict = {prop:metadata[prop] for prop in self.properties}
        self.dict["description"] = self.dict["description"].replace('\n', ' ').replace('\r', '')


class Articles2Points:
    def __init__(self):
        if torch.cuda.is_available():
            self.device = torch.device("cuda:0")
        else:
            self.device = torch.device("cpu")
        self.tokenizer = tr.DistilBertTokenizer.from_pretrained('distilbert-base-uncased')
        self.model = tr.DistilBertModel.from_pretrained('distilbert-base-uncased').to(self.device)
        self.mds = MDS(n_components = 3, metric = True)


    def __call__(self, articles: List[Article]):
        data = []
        for article in articles:
            data.append(article.dict["description"])

        tokenized = self.tokenizer(data, add_special_tokens=True, padding = True, truncation = True)

        input_data = tokenized['input_ids']
        mask = tokenized['attention_mask']

        input_ids = torch.tensor(input_data).to(self.device)
        mask = torch.tensor(mask).to(self.device)
        
        with torch.no_grad():
            embeddings = self.model(input_ids, attention_mask=mask)
            
        first_embed = embeddings[0][:, 0, :]
        points = self.mds.fit_transform(first_embed.cpu())

        for i, article in enumerate(articles):
            point3d = points[i]
            article.dict["px"] = point3d[0]
            article.dict["py"] = point3d[1]
            article.dict["pz"] = point3d[2]
            article.dict["dissimilarity"] = self.mds.dissimilarity_matrix_[i].tolist()

        return points

def Data2Articles(data: List[dict], discard_duplicates: bool = True) -> List[Article]:
    articles = []
    checked = set()
    for article in data:
        id = article['title']
        if id not in checked and "description" in article:
            articles.append(Article(article))
            checked.add(id)
    return articles