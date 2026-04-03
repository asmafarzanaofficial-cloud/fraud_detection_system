import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import pickle

# load dataset
data = pd.read_csv("dataset/fraud_dataset.csv")

# use ONLY Amount
X = data[["Amount"]]
y = data["Class"]

# train model
model = RandomForestClassifier()
model.fit(X, y)

# save model
pickle.dump(model, open("fraud_model.pkl", "wb"))

print("Model trained successfully using Amount!")