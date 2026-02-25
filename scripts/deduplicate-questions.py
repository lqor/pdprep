#!/usr/bin/env python3
"""
Apply Option C hybrid deduplication strategy to PDPrep questions.

Strategy: Keep 2-3 questions per concept (from the 44 groups of 5).
Result: Reduce from 220 questions to ~110 questions while maintaining learning value.

Selection criteria:
- Keep questions with most distinct scenarios
- Prioritize questions that test different aspects of the concept
- Maintain even distribution across topics
"""

import json
from typing import Dict, List, Set

# Define the 44 duplicate groups (each has 5 questions)
# Keep 2-3 questions per group based on learning value
GROUPS_TO_KEEP = {
    # Format: group_start_index: [indices_to_keep]

    # Data Modeling & Management (55 questions → 27-28)
    0: [0, 2],  # Roll-up summary basics - keep 2 distinct scenarios
    5: [5, 7],  # Roll-up average calculation - keep 2 variations
    10: [10, 12, 14],  # Many-to-many (junction) - keep 3 (important concept)
    15: [15, 17, 19],  # Upsert with External ID - keep 3 (common pattern)
    20: [20, 22],  # Data Loader - keep 2
    25: [25, 27],  # Record Types - keep 2
    30: [30, 32],  # Schema Builder - keep 2

    # SOQL/SOSL (part of Data Modeling)
    35: [35, 37],  # SOSL searches - keep 2 (already improved)
    40: [40, 42],  # Parent-to-child subqueries - keep 2 (have code snippets)
    45: [45, 47],  # Schema.getGlobalDescribe() - keep 2
    50: [50, 52],  # Formula fields - keep 2 (already improved)

    # Process Automation & Logic (55 questions → 27-28)
    55: [55, 57],  # Record-triggered flows (create/update) - keep 2
    60: [60, 62],  # Schedule-triggered flows - keep 2
    65: [65, 67, 69],  # Validation rules - keep 3 (important)
    70: [70, 72],  # Before-insert triggers - keep 2
    75: [75, 77],  # After-insert triggers (with code) - keep 2
    80: [80, 82],  # Trigger.new vs Trigger.old - keep 2
    85: [85, 87],  # Test methods - keep 2
    90: [90, 92],  # Set collection deduplication - keep 2
    95: [95, 97],  # Queueable Apex - keep 2 (have code)
    100: [100, 102],  # Batch Apex - keep 2 (have code)
    105: [105, 107],  # Future methods - keep 2
    110: [110, 112],  # Governor limits - keep 2
    115: [115, 117],  # Bulkification - keep 2 (have code)
    120: [120, 122],  # SOQL FOR loops - keep 2 (have code)
    125: [125, 127],  # Database.insert with DML options - keep 2
    130: [130, 132],  # DescribeFieldResult.isUpdateable() - keep 2

    # Salesforce Fundamentals (55 questions → 27-28)
    135: [135, 137],  # 'with sharing' - keep 2
    140: [140, 142],  # Permission sets - keep 2
    145: [145, 147],  # Change sets - keep 2
    150: [150, 152],  # Sandboxes - keep 2
    155: [155, 157, 159],  # Code coverage - keep 3 (exam critical)
    160: [160, 162],  # Debug log categories - keep 2

    # User Interface / LWC (55 questions → 27-28)
    165: [165, 167],  # LWC vs Aura - keep 2
    170: [170, 172],  # @AuraEnabled - keep 2 (have code)
    175: [175, 177],  # @api decorator - keep 2 (already improved)
    180: [180, 182],  # Lightning Data Service - keep 2
    185: [185, 187],  # Imperative Apex in LWC - keep 2 (have code)
    190: [190, 192],  # Lightning Message Service - keep 2
    195: [195, 197],  # NavigationMixin - keep 2 (have code)
    200: [200, 202],  # Record-triggered flows (declarative) - keep 2
    205: [205, 207],  # Lightning App Builder - keep 2
    210: [210, 212],  # Base record form components - keep 2
    215: [215, 217, 219],  # Custom labels for translation - keep 3 (i18n important)
}

def load_questions(filepath: str) -> List[Dict]:
    """Load questions from JSON file."""
    with open(filepath, 'r') as f:
        return json.load(f)

def save_questions(questions: List[Dict], filepath: str):
    """Save questions to JSON file with pretty formatting."""
    with open(filepath, 'w') as f:
        json.dump(questions, f, indent=2)

def get_indices_to_keep() -> Set[int]:
    """Get flat set of all indices to keep."""
    indices = set()
    for group_indices in GROUPS_TO_KEEP.values():
        indices.update(group_indices)
    return indices

def deduplicate_questions(questions: List[Dict]) -> List[Dict]:
    """Keep only the selected questions based on deduplication strategy."""
    indices_to_keep = get_indices_to_keep()

    deduplicated = []
    for idx, question in enumerate(questions):
        if idx in indices_to_keep:
            deduplicated.append(question)

    return deduplicated

def count_by_topic(questions: List[Dict]) -> Dict[str, int]:
    """Count questions by topic."""
    counts = {}
    for q in questions:
        topic = q['topic']
        counts[topic] = counts.get(topic, 0) + 1
    return counts

def main():
    filepath = '/Users/igorkudryk/Salesforce/cohorts/pdprep/data/seed/pd1_prep_questions.json'

    print("Loading questions...")
    questions = load_questions(filepath)
    print(f"Original: {len(questions)} questions")

    # Show original distribution
    print("\nOriginal distribution by topic:")
    for topic, count in sorted(count_by_topic(questions).items()):
        print(f"  {topic}: {count}")

    # Apply deduplication
    print("\nApplying hybrid deduplication (Option C)...")
    deduplicated = deduplicate_questions(questions)

    print(f"After deduplication: {len(deduplicated)} questions")
    print(f"Removed: {len(questions) - len(deduplicated)} questions")

    # Show new distribution
    print("\nNew distribution by topic:")
    topic_counts = count_by_topic(deduplicated)
    for topic, count in sorted(topic_counts.items()):
        print(f"  {topic}: {count}")

    # Validate we kept the right amount per topic
    print("\nValidation:")
    total_kept = sum(len(indices) for indices in GROUPS_TO_KEEP.values())
    print(f"  Expected to keep: ~{total_kept} questions")
    print(f"  Actually kept: {len(deduplicated)} questions")
    print(f"  Match: {'✅' if len(deduplicated) == total_kept else '❌'}")

    # Save deduplicated questions
    print(f"\nSaving to {filepath}...")
    save_questions(deduplicated, filepath)
    print("✅ Deduplication complete!")

if __name__ == '__main__':
    main()
