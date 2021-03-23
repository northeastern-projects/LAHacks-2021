import json

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
import tensorflow.compat.v1 as tf
import tensorflow_hub as hub

# tf.disable_v2_behavior()

# load universal sentence encoder module
def load_USE_encoder(module):  # noqa
    with tf.Graph().as_default():
        sentences = tf.placeholder(tf.string)
        embed = hub.Module(module)
        embeddings = embed(sentences)
        session = tf.train.MonitoredSession()
    return lambda x: session.run(embeddings, {sentences: x})


# load the encoder module
encoder = load_USE_encoder("./models")

# define some messages

with open("../API-Fetch/out_parsed.json", "r") as PAPERS_JSON:
    PAPERS = json.load(PAPERS_JSON)
messages = [paper["title"] for paper in PAPERS]

print(messages)
# encode the messages
encoded_messages = encoder(messages)

print(encoded_messages)

# cosine similarities
num_messages = len(messages)
similarities_df = pd.DataFrame()
for i in range(num_messages):
    for j in range(num_messages):
        # cos(theta) = x * y / (mag_x * mag_y)
        dot_product = np.dot(encoded_messages[i], encoded_messages[j])
        mag_i = np.sqrt(np.dot(encoded_messages[i], encoded_messages[i]))
        mag_j = np.sqrt(np.dot(encoded_messages[j], encoded_messages[j]))

        cos_theta = dot_product / (mag_i * mag_j)

        similarities_df = similarities_df.append(
            {
                "similarity": cos_theta,
                "message1": messages[i],
                "message2": messages[j],
            },
            ignore_index=True,
        )


# convert similarity matrix into dataframe
similarity_heatmap = similarities_df.pivot(
    "message1", "message2", "similarity"
)

# visualize the results
ax = sns.heatmap(similarity_heatmap, cmap="YlGnBu")
plt.show()
