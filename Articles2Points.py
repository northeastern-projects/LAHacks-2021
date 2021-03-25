import torch
import transformers as tr
from sklearn.manifold import MDS
import json


class Article:
    def __init__(self, metadata: dict):
        self.title = metadata["title"]
        if "description" in metadata: self.description = metadata["description"].replace('\n', ' ').replace('\r', '')
        # <Insert stuff about citations, urls, etc.>
        self.position = (0, 0, 0)


    def get_data(self):
        if self.description:
            return self.description
        else:
            return self.title
    
    
    def to_unity_json_dict(self) -> dict:
        dictionary = self.__dict__.copy()
        dictionary["position"] = {"x": self.position[0], "y": self.position[1], "z": self.position[2]}
        return dictionary



class Articles2Points:
    def __init__(self):
        if torch.cuda.is_available():
            self.device = torch.device("cuda:0")
        else:
            self.device = torch.device("cpu")
        self.tokenizer = tr.DistilBertTokenizer.from_pretrained('distilbert-base-uncased')
        self.model = tr.DistilBertModel.from_pretrained('distilbert-base-uncased').to(self.device)
        self.mds = MDS(n_components = 3)


    def __call__(self, articles: list[Article]):
        data = []
        for article in articles:
            data.append(article.get_data())

        tokenized = self.tokenizer(data, add_special_tokens=True, padding = True, truncation = True)

        input_data = tokenized['input_ids']
        mask = tokenized['attention_mask']

        input_ids = torch.tensor(input_data).to(self.device)
        mask = torch.tensor(mask).to(self.device)
        
        with torch.no_grad():
            embeddings = self.model(input_ids, attention_mask=mask)
            
        first_embed = embeddings[0][:, 0, :]
        points = self.mds.fit_transform(first_embed.cpu())
        dissimilarity_matrix = self.mds.dissimilarity_matrix_

        for i, article in enumerate(articles):
            point3d = points[i]
            article.position = point3d
            article.dissimilarity = dissimilarity_matrix[i].tolist()

        return points


def Articles2UnityJson(articles: list[Article]) -> str:
    json_list = []
    for article in articles:
        json_list.append(article.to_unity_json_dict())
    json_dict = {"Articles": json_list}
    return json.dumps(json_dict)


def Data2Articles(data: list[dict], discard_duplicates: bool = True) -> list[Article]:
    articles = []
    checked = set()
    for article in data:
        id = article['title']
        if id not in checked:
            articles.append(Article(article))
            checked.add(id)
    return articles
