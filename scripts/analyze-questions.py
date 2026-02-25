#!/usr/bin/env python3
"""
Analyze pd1_prep_questions.json for content quality issues.
Generates a detailed report on duplicates, shallow explanations,
missing code snippets, and other quality concerns.
"""

import json
from collections import defaultdict
from typing import Dict, List, Tuple

def load_questions(filepath: str) -> List[Dict]:
    """Load questions from JSON file."""
    with open(filepath, 'r') as f:
        return json.load(f)

def find_duplicate_patterns(questions: List[Dict]) -> Dict[str, List[int]]:
    """Find questions with identical or very similar content."""
    duplicates = defaultdict(list)

    # Group by explanation text
    explanation_map = defaultdict(list)
    for idx, q in enumerate(questions):
        explanation_map[q['explanation']].append(idx)

    # Find duplicates (explanation used 3+ times suggests templated questions)
    for explanation, indices in explanation_map.items():
        if len(indices) >= 3:
            duplicates[explanation] = indices

    return duplicates

def analyze_explanation_quality(questions: List[Dict]) -> List[Tuple[int, int, str]]:
    """Return list of (index, length, preview) for questions with short explanations."""
    short_explanations = []

    for idx, q in enumerate(questions):
        exp_len = len(q['explanation'])
        if exp_len < 100:  # Less than 100 chars is quite short
            preview = q['content'][:80] + '...' if len(q['content']) > 80 else q['content']
            short_explanations.append((idx, exp_len, preview))

    return sorted(short_explanations, key=lambda x: x[1])

def find_code_snippet_opportunities(questions: List[Dict]) -> List[Tuple[int, str]]:
    """Find questions that mention code concepts but lack code snippets."""
    opportunities = []
    code_keywords = [
        'apex', 'soql', 'sosl', 'trigger', 'class', 'method',
        'lwc', 'aura', 'component', 'javascript', 'debug',
        'loop', 'list<', 'map<', 'set<', 'query', 'dml'
    ]

    for idx, q in enumerate(questions):
        # Skip questions that already have code snippets
        if q.get('codeSnippet'):
            continue

        content_lower = q['content'].lower()
        # Check if question mentions code concepts
        if any(keyword in content_lower for keyword in code_keywords):
            opportunities.append((idx, q['content'][:100]))

    return opportunities

def analyze_reference_urls(questions: List[Dict]) -> Dict[str, List[int]]:
    """Analyze reference URL patterns and find potential issues."""
    url_patterns = defaultdict(list)

    for idx, q in enumerate(questions):
        url = q.get('referenceUrl', '')

        # Categorize URLs
        if 'trailhead.salesforce.com' in url:
            url_patterns['trailhead'].append(idx)
        elif 'developer.salesforce.com/docs' in url:
            url_patterns['developer_docs'].append(idx)
        elif 'resources.docs.salesforce.com' in url and url.endswith('.pdf'):
            url_patterns['pdf_guides'].append(idx)
        elif url:
            url_patterns['other'].append(idx)
        else:
            url_patterns['missing'].append(idx)

    return url_patterns

def count_topics(questions: List[Dict]) -> Dict[str, int]:
    """Count questions by topic."""
    topics = defaultdict(int)
    for q in questions:
        topics[q['topic']] += 1
    return topics

def main():
    filepath = '/Users/igorkudryk/Salesforce/cohorts/pdprep/data/seed/pd1_prep_questions.json'
    questions = load_questions(filepath)

    print(f"Total questions: {len(questions)}\n")

    # Topic distribution
    print("=" * 80)
    print("TOPIC DISTRIBUTION")
    print("=" * 80)
    topics = count_topics(questions)
    for topic, count in sorted(topics.items()):
        print(f"{topic}: {count}")

    # Duplicate patterns
    print("\n" + "=" * 80)
    print("DUPLICATE EXPLANATION PATTERNS (used 5+ times)")
    print("=" * 80)
    duplicates = find_duplicate_patterns(questions)
    duplicate_groups = [(exp, indices) for exp, indices in duplicates.items() if len(indices) >= 5]
    duplicate_groups.sort(key=lambda x: len(x[1]), reverse=True)

    for exp, indices in duplicate_groups[:15]:  # Top 15 most duplicated
        print(f"\n{len(indices)}x (indices: {indices[:10]}{'...' if len(indices) > 10 else ''})")
        print(f"   {exp[:150]}{'...' if len(exp) > 150 else ''}")

    # Short explanations
    print("\n" + "=" * 80)
    print("SHORTEST EXPLANATIONS (Top 30)")
    print("=" * 80)
    short_exps = analyze_explanation_quality(questions)
    for idx, length, preview in short_exps[:30]:
        print(f"{idx}: {length} chars - {preview}")

    # Code snippet opportunities
    print("\n" + "=" * 80)
    print("CODE SNIPPET OPPORTUNITIES (questions about code without snippets)")
    print("=" * 80)
    opportunities = find_code_snippet_opportunities(questions)
    print(f"Found {len(opportunities)} questions that could benefit from code snippets")
    print(f"Currently only {sum(1 for q in questions if q.get('codeSnippet'))} questions have code snippets\n")
    print("Top 20 candidates:")
    for idx, preview in opportunities[:20]:
        print(f"{idx}: {preview}...")

    # Reference URL analysis
    print("\n" + "=" * 80)
    print("REFERENCE URL ANALYSIS")
    print("=" * 80)
    url_patterns = analyze_reference_urls(questions)
    for pattern, indices in sorted(url_patterns.items(), key=lambda x: len(x[1]), reverse=True):
        print(f"{pattern}: {len(indices)} questions")
        if pattern == 'pdf_guides':
            print(f"   Note: PDF links may become stale. Consider linking to web docs.")

    # Summary stats
    print("\n" + "=" * 80)
    print("QUALITY SUMMARY")
    print("=" * 80)
    print(f"Questions with explanations < 80 chars: {sum(1 for _, l, _ in short_exps if l < 80)}")
    print(f"Questions with code snippets: {sum(1 for q in questions if q.get('codeSnippet'))}")
    print(f"Questions needing code snippets: {len(opportunities)}")
    print(f"Duplicate explanation groups (5+ uses): {len(duplicate_groups)}")
    print(f"Total questions in duplicate groups: {sum(len(indices) for _, indices in duplicate_groups)}")

if __name__ == '__main__':
    main()
