#from langchain import PromptTemplate, LLMChain
from langchain_core.prompts import PromptTemplate
from langchain.chains import LLMChain

from langchain_community.llms import OpenAI
from langchain_openai import OpenAI

import os
from dotenv import load_dotenv

load_dotenv()

# Initialize OpenAI LLM
llm = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Create a prompt template
template = """
You are a helpful AI assistant that helps users with their questions about products and suppliers.

User Question: {question}

Please provide a helpful response:
"""

prompt = PromptTemplate(template=template, input_variables=["question"])
# llm_chain = RunnableSequence([prompt, llm])
llm_chain = LLMChain(prompt=prompt, llm=llm)


def get_llm_response(question: str) -> str:
    """
    Get response from LLM model
    """
    try:
        response = llm_chain.run(question=question)
        return response.strip()
    except Exception as e:
        print(f"Error getting LLM response: {e}")
        return "I apologize, but I'm having trouble processing your request right now. Please try again later."