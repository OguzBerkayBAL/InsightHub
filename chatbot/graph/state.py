from typing import List, TypedDict, Union, Optional
from langchain_core.documents import Document


class GraphState(TypedDict, total=False):
    """
    Represents the state of our graph.

    Attributes:
        question: The user's original question
        generation: The generated response from LLM
        web_search: Flag indicating whether web search should be used
        documents: List of retrieved documents
    """

    question: str
    generation: Optional[str]
    web_search: bool
    documents: Optional[List[Union[Document, dict, str]]]