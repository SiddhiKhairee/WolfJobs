import spacy
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import sys

nlp = spacy.load("en_core_web_sm")

question_templates = {
    "coding": [
        "Describe your experience with [SKILL].",
        "What projects have you worked on involving [SKILL]?",
        "How would you rate your proficiency in [SKILL]?",
        "Can you give an example of a complex [SKILL] problem you've solved?",
        "How do you stay updated with the latest trends in [SKILL]?"
    ],
    "cooking": [
        "What cuisines are you most experienced with?",
        "How do you ensure consistency in your cooking?",
        "Describe a challenging dish you've mastered.",
        "How do you handle time management in the kitchen?",
        "What is your experience with [SKILL] techniques?"
    ],
    "fitness": [
        "What is your experience level with [SKILL] training?",
        "How do you customize workout plans for different clients?",
        "Describe your approach to tracking client progress.",
        "How do you motivate clients to achieve their fitness goals?",
        "What certifications do you have related to [SKILL]?"
    ]
}

def extract_keywords(job_description):
    doc = nlp(job_description)
    keywords = set()
    for token in doc:
        if token.pos_ in ["NOUN", "PROPN"] and not token.is_stop:
            keywords.add(token.text.lower())
    return list(keywords)


def generate_questions(job_description, job_type):
    keywords = extract_keywords(job_description)
    templates = question_templates.get(job_type, [])
    
    questions = []
    for keyword in keywords:
        for template in templates:
            # Replace placeholders in the template with extracted keywords
            question = template.replace("[SKILL]", keyword)
            questions.append(question)
                
    return questions

job_description = sys.argv[1]
job_type = sys.argv[2].lower()

print(generate_questions(job_description, job_type)[:4])

# job_description = """
# Looking for a web developer. Should know javascript and must be familiar with react and redux.
# """
# job_type = "coding"  
# questions = generate_questions(job_description, job_type)
# top_questions = questions[:5]

# # Display generated questions
# for idx, question in enumerate(questions, 1):
#     print(f"{idx}. {question}")