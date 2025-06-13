from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.pydantic_v1 import BaseModel, Field
from typing import Literal
from dotenv import load_dotenv
load_dotenv()


#bu sınıfın alacağı değişken ya vectorstoredir ya da web searchtir.
#... anlamı ya vector store ya da web search olacağını ifade ediyor
class RouteQuery(BaseModel):
    """Route a user query to the most relevant datasource."""

    datasource: Literal["vectorstore", "websearch"] = Field(
        ...,
        description="Given a user question choose to route it to web search or a vectorstore.",
    )


llm = ChatOpenAI(temperature=0)
#structured_llm_router çıktıyı yapısal şekilde bakar class ile cevabı bağlıyoruz
structured_llm_router = llm.with_structured_output(RouteQuery)

system = """You are an expert at routing a user question to the appropriate datasource.

RULES FOR ROUTING:
1. Use "vectorstore" for:
   - ANY query about specific academic papers, regardless of language
   - ANY query that contains a paper title (usually in quotes or with distinctive capitalization)
   - ANY query asking about a specific research paper or publication
   - ANY query that asks for information, summary, or explanation of academic papers
   - Questions containing academic terminology like "paper", "research", "study", "makale", "araştırma"
   
2. Use "websearch" ONLY for:
   - General knowledge questions with no mention of papers or academic research
   - Current events or news that wouldn't be in academic literature
   - Personal questions or non-academic topics

IMPORTANT: If the query mentions ANY paper title or academic publication, no matter how it's phrased, 
ALWAYS route it to "vectorstore". When in doubt, prefer "vectorstore" over "websearch".

The vectorstore contains academic papers and research documents, so any query related to papers
should be directed there."""
route_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system),
        ("human", "{question}"),
    ]
)

question_router = route_prompt | structured_llm_router


