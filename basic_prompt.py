from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

basic_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant. Use the provided context to answer questions. If you don't know the answer based on the context, say so."),
    MessagesPlaceholder(variable_name="history"),
    ("system", "Context:\n{context}"),
    ("human", "{question}")
])
