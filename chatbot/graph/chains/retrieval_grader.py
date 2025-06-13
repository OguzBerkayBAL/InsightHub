from langchain_core.pydantic_v1 import BaseModel, Field
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from typing import Literal
from dotenv import load_dotenv
import os

load_dotenv()


class GradeDocuments(BaseModel):
    binary_score: Literal["yes", "no"] = Field(description="Yes if document is relevant, no if it is not relevant.")


llm = ChatOpenAI(temperature=0)


structured_llm_grader = llm.with_structured_output(GradeDocuments)

system = """You are an expert at evaluating the relevance of a document to a given question.

EVALUATION CRITERIA:
1. A document is relevant if:
   - It contains direct answers to the question
   - It provides information that would help answer the question
   - It discusses the same topic as the question
   - It contains key concepts, terms, or people mentioned in the question
   - It is about the same academic paper or closely related papers

2. A document is NOT relevant if:
   - It is completely off-topic
   - It doesn't contain any information related to the question
   - It addresses a different subject area entirely

BE CONSISTENT IN YOUR EVALUATIONS. Documents with similar levels of relevance should receive the same grade.
When in doubt about relevance, lean towards marking it as relevant ("yes").

For academic paper queries, consider terminology matches and conceptual relevance.
Answer with "yes" or "no" to indicate relevance."""

grade_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system),
        ("human", "Retrieved document: \n\n {document} \n\n User question: {question}"),
    ]
)

retrieval_grader = grade_prompt | structured_llm_grader