# # import os
# # from dotenv import load_dotenv
# # from langchain_core.output_parsers import StrOutputParser,JsonOutputParser
# # # from langchain.memory import ConversationBufferMemory
# # from langachain_core.runnables.history import RunnableWithMessageHistory



# # load_dotenv()

# # from basic_prompt import basic_prompt
# # from langchain_openai import ChatOpenAI

# # memory = ConversationBufferMemory(
# #     memory_key="chat_history",
# #     return_messages=True
# # )

# # def get_session_memory(session_id: str):
# #     return memory


# # chain_with_memory = RunnableWithMessageHistory(
# #     chain,
# #     get_session_history=get_session_memory,
# #     input_messages_key="question",
# #     history_messages_key="chat_history"
# # )


# # llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
# # parser = StrOutputParser()
# # json_parser = JsonOutputParser()


# # prompt_text = basic_prompt.format(
# #     question="Explain how the internet works?",
# #     format_instructions=json_parser.get_format_instructions()
# # )




# # #response = llm.invoke(prompt_text)

# # # LCEL - LangChain Expression Language
# # chain = basic_prompt | llm | json_parser

# # # response = chain.invoke({
# # #     "question": "Explain how the internet works?",
# # #     "format_instructions": json_parser.get_format_instructions()
# # #     })

# # response = chain_with_memory.invoke({
# #     "question": "Explain how the internet works?",
# #     "format_instructions": json_parser.get_format_instructions()
# #     },
# #     config={"configurable": {"session_id": "demo-session"}}
# #     )


# # response2 = chain_with_memory.invoke(
# #     {
# #         "question": "Explain it again but simpler",
# #         "format_instructions": json_parser.get_format_instructions()
# #     },
# #     config={"configurable": {"session_id": "demo-session"}}
# # )

# # print(response2)

# # print("=== Prompt Sent ===")
# # print(prompt_text)
# # print("\n=== Model Response ===")
# # print(response)
# # print("\n=== Model Response Type ===")
# # print(type(response))


# # import os
# # from dotenv import load_dotenv
# # load_dotenv()

# # from langchain_openai import ChatOpenAI
# # from langchain_core.output_parsers import JsonOutputParser
# # from langchain_core.runnables.history import RunnableWithMessageHistory
# # from langchain_core.documents import Document
# # from langchain_openai import OpenAIEmbeddings
# # from langchain_community.vectorstores import FAISS
# # from langchain_core.runnables import RunnablePassthrough




# # from basic_prompt import basic_prompt

# # rag_chain = (
# #     {
# #         "context": retriever,
# #         "question": RunnablePassthrough(),
# #     }
# #     | base_chain
# # )

# # documents = [
# #     Document(
# #         page_content="The internet is a global network of computers that communicate using standardized protocols."
# #     ),
# #     Document(
# #         page_content="Data on the internet is transmitted in packets using protocols like TCP/IP."
# #     ),
# #     Document(
# #         page_content="Routers and switches help direct data across networks to reach the correct destination."
# #     ),
# # ]

# # vectorstore = FAISS.from_documents(documents, embeddings)
# # retriever = vectorstore.as_retriever(search_kwargs={"k": 2})


# # llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
# # json_parser = JsonOutputParser()

# # base_chain = basic_prompt | llm | json_parser


# # embeddings = OpenAIEmbeddings()



# # from langchain_core.chat_history import InMemoryChatMessageHistory

# # store = {}

# # def get_session_history(session_id: str):
# #     if session_id not in store:
# #         store[session_id] = InMemoryChatMessageHistory()
# #     return store[session_id]

# # # chain_with_memory = RunnableWithMessageHistory(
# # #     base_chain,
# # #     get_session_history,
# # #     input_messages_key="question",
# # #     history_messages_key="history",
# # # )
# # rag_chain_with_memory = RunnableWithMessageHistory(
# #     rag_chain,
# #     get_session_history,
# #     input_messages_key="question",
# #     history_messages_key="history",
# # )

# # response1 = rag_chain_with_memory.invoke(
# #     {
# #         "question": "Explain how the internet works",
# #         "format_instructions": json_parser.get_format_instructions()
# #     },
# #     config={"configurable": {"session_id": "demo-session"}}
# # )

# # print(response1)

# # response2 = rag_chain_with_memory.invoke(
# #     {
# #         "question": "Explain it again but simpler",
# #         "format_instructions": json_parser.get_format_instructions()
# #     },
# #     config={"configurable": {"session_id": "demo-session"}}
# # )

# # print(response2)


# import os
# from dotenv import load_dotenv
# load_dotenv()

# # ======================
# # Imports
# # ======================
# from langchain_openai import ChatOpenAI, OpenAIEmbeddings
# from langchain_core.output_parsers import JsonOutputParser
# from langchain_core.documents import Document
# from langchain_core.runnables import RunnablePassthrough
# from langchain_core.runnables import RunnableLambda
# from langchain_core.runnables.history import RunnableWithMessageHistory
# from langchain_core.chat_history import InMemoryChatMessageHistory
# from sqlalchemy import create_engine, text

# from langchain_postgres import PGVector


# from basic_prompt import basic_prompt


# get_question = RunnableLambda(lambda x: x["question"])

# # ======================
# # 1️⃣ Documents
# # ======================
# documents = [
#     Document(
#         page_content="The internet is a global network of computers that communicate using standardized protocols."
#     ),
#     Document(
#         page_content="Data on the internet is transmitted in packets using protocols like TCP/IP."
#     ),
#     Document(
#         page_content="Routers and switches help direct data across networks to reach the correct destination."
#     ),
# ]
# def format_docs(docs):
#     return "\n\n".join(doc.page_content for doc in docs)


# # ======================
# # 2️⃣ Embeddings
# # ======================
# embeddings = OpenAIEmbeddings()


# # ======================
# # 3️⃣ Vector Store
# # ======================
# # Connection string format: postgresql+psycopg://username:password@host:port/database
# # Can be overridden with environment variable PGVECTOR_CONNECTION_STRING
# CONNECTION_STRING = (
#     "postgresql+psycopg://langchain:langchain@127.0.0.1:5433/langchain"
# )


# print(f"🔄 Connecting to PostgreSQL with PGVector...")
# print(f"   Connection: {CONNECTION_STRING.split('@')[0]}@***/***")  # Hide password in output

# # Test connection first
# try:
#     print("   Testing connection...")
#     test_engine = create_engine(CONNECTION_STRING)
#     with test_engine.connect() as conn:
#         result = conn.execute(text("SELECT version();"))
#         version = result.fetchone()[0]
#         print(f"   ✅ Connection test successful! PostgreSQL version: {version.split(',')[0]}")
# except Exception as test_error:
#     print(f"   ❌ Connection test failed: {test_error}")
#     print("\n💡 Make sure:")
#     print("   1. Docker container is running: docker-compose ps")
#     print("   2. Database is ready: docker-compose logs postgres")
#     print("   3. No local PostgreSQL is using port 5432")
#     raise

# print("   Creating vector store...")
# try:
#     vectorstore = PGVector.from_documents(
#         documents=documents,
#         embedding=embeddings,
#         collection_name="internet_docs",
#         connection=CONNECTION_STRING,
#     )
#     print("✅ Successfully created vector store in PostgreSQL!")
# except Exception as e:
#     error_msg = str(e)
#     print("\n❌ Failed to connect to PostgreSQL!")
#     print(f"Error: {error_msg}\n")
    
#     if "role" in error_msg.lower() and "does not exist" in error_msg.lower():
#         print("💡 The database user 'langchain' doesn't exist.")
#         print("   This usually means the Docker container isn't running or wasn't set up correctly.\n")
#         print("📋 To fix this, run these commands:")
#         print("   1. docker-compose down -v  # Remove old containers and volumes")
#         print("   2. docker-compose up -d    # Start fresh PostgreSQL container")
#         print("   3. Wait a few seconds for the database to initialize")
#         print("   4. Run this script again\n")
#     elif "connection" in error_msg.lower() and "failed" in error_msg.lower():
#         print("💡 Cannot connect to PostgreSQL server.")
#         print("   Make sure Docker is running and the container is started.\n")
#         print("📋 To fix this, run:")
#         print("   docker-compose up -d\n")
    
#     print("🔍 Check if the container is running:")
#     print("   docker-compose ps")
#     print("\n🔍 View container logs if needed:")
#     print("   docker-compose logs postgres")
#     raise

# # ======================
# # 4️⃣ Retriever
# # ======================
# retriever = vectorstore.as_retriever(search_kwargs={"k": 2})


# # ======================
# # 5️⃣ Model + Parser
# # ======================
# llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
# from langchain_core.output_parsers import StrOutputParser
# output_parser = StrOutputParser()


# # ======================
# # 6️⃣ Base LCEL Chain
# # ======================
# base_chain = basic_prompt | llm | output_parser


# # ======================
# # 7️⃣ RAG Chain
# # ======================
# # Extract question string before passing to retriever
# rag_chain = (
#     {
#         "context": get_question | retriever | format_docs,
#         "question": get_question,
#     }
#     | base_chain
# )


# # ======================
# # 8️⃣ Memory Store
# # ======================
# store = {}

# def get_session_history(session_id: str):
#     if session_id not in store:
#         store[session_id] = InMemoryChatMessageHistory()
#     return store[session_id]


# # ======================
# # 9️⃣ RAG + Memory
# # ======================
# rag_chain_with_memory = RunnableWithMessageHistory(
#     rag_chain,
#     get_session_history,
#     input_messages_key="question",
#     history_messages_key="history",
# )


# # ======================
# # 🔟 Invoke
# # ======================
# print("=" * 60)
# print("Query 1: Explain how the internet works")
# print("=" * 60)
# response1 = rag_chain_with_memory.invoke(
#     {
#         "question": "Explain how the internet works"
#     },
#     config={"configurable": {"session_id": "demo-session"}}
# )

# print("\n✅ Response 1:")
# print(response1)
# print("\n" + "=" * 60)

# print("\nQuery 2: Explain it again but simpler")
# print("=" * 60)
# response2 = rag_chain_with_memory.invoke(
#     {
#         "question": "Explain it again but simpler"
#     },
#     config={"configurable": {"session_id": "demo-session"}}
# )

# print("\n✅ Response 2:")
# print(response2)
# print("\n" + "=" * 60)