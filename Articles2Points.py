import torch
import transformers as tr
from sklearn.manifold import MDS


class Articles2Points:
    def __init__(self):
        if torch.cuda.is_available():
            self.device = torch.device("cuda:0")
        else:
            self.device = torch.device("cpu")
        self.tokenizer = tr.DistilBertTokenizer.from_pretrained('distilbert-base-uncased')
        self.model = tr.DistilBertModel.from_pretrained('distilbert-base-uncased').to(self.device)
        self.mds = MDS(n_components = 3)


    def article2data(self, article):
        # depends on implementation of article (dict or class)
        if "description" in article:
            return article["description"]
        else:
            return article["title"]


    def __call__(self, articles):
        data = []
        for article in articles:]
            data.append(self.article2data(article))

        tokenized = self.tokenizer(data, add_special_tokens=True, padding = True, truncation = True)

        input_data = tokenized['input_ids']
        mask = tokenized['attention_mask']

        input_ids = torch.tensor(input_data).to(self.device)
        mask = torch.tensor(mask).to(self.device)
        
        with torch.no_grad():
            embeddings = self.model(input_ids, attention_mask=mask)
            
        first_embed = embeddings[0][:, 0, :]
        points = self.mds.fit_transform(first_embed.cpu())

        return points