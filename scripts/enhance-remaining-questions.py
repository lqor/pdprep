#!/usr/bin/env python3
"""
Enhance remaining questions after deduplication to make each variation unique.
Add more code snippets and improve explanations for better learning value.
"""

import json
from typing import Dict, List

# Additional explanation improvements for questions that still need work
ADDITIONAL_EXPLANATIONS = {
    # Find the new indices after deduplication by looking at the content
    # We'll improve questions that weren't enhanced in Phase 1
}

# Additional code snippets for questions that need examples
ADDITIONAL_CODE_SNIPPETS = {
    # These will be added by index after we verify the deduplication results
    # Targeting: triggers, future methods, additional LWC examples
}

# Differentiation improvements - make similar questions test different aspects
QUESTION_DIFFERENTIATIONS = {
    # We'll enhance questions to test different nuances of each concept
    # For example, if we kept 2 roll-up summary questions, one should focus on
    # the relationship requirement, the other on the field type or use case
}

def load_questions(filepath: str) -> List[Dict]:
    """Load questions from JSON file."""
    with open(filepath, 'r') as f:
        return json.load(f)

def save_questions(questions: List[Dict], filepath: str):
    """Save questions to JSON file."""
    with open(filepath, 'w') as f:
        json.dump(questions, f, indent=2)

def find_question_by_content(questions: List[Dict], content_snippet: str) -> int:
    """Find question index by partial content match."""
    for idx, q in enumerate(questions):
        if content_snippet.lower() in q['content'].lower():
            return idx
    return -1

def enhance_trigger_examples(questions: List[Dict]):
    """Add code snippets to trigger-related questions."""
    changes = 0

    # Find before-insert trigger questions
    for idx, q in enumerate(questions):
        if 'before-insert' in q.get('explanation', '').lower() and not q.get('codeSnippet'):
            q['codeSnippet'] = """// Before-insert trigger example
trigger OpportunityTrigger on Opportunity (before insert) {
    for (Opportunity opp : Trigger.new) {
        // Set default values before insert
        if (opp.Probability == null) {
            if (opp.StageName == 'Prospecting') {
                opp.Probability = 10;
            } else if (opp.StageName == 'Qualification') {
                opp.Probability = 25;
            }
        }
    }
}"""
            changes += 1
            break  # Only add to one example

    # Find after-insert trigger questions without code
    for idx, q in enumerate(questions):
        if 'after-insert' in q.get('explanation', '').lower() and not q.get('codeSnippet'):
            q['codeSnippet'] = """// After-insert trigger example
trigger CaseTrigger on Case (after insert) {
    List<Task> tasks = new List<Task>();

    for (Case c : Trigger.new) {
        // Create follow-up task after case creation
        if (c.Priority == 'High') {
            tasks.add(new Task(
                Subject = 'Follow up on high priority case',
                WhatId = c.Id,
                ActivityDate = Date.today().addDays(1)
            ));
        }
    }

    if (!tasks.isEmpty()) {
        insert tasks;
    }
}"""
            changes += 1
            break

    # Find Trigger.new vs Trigger.old questions
    for idx, q in enumerate(questions):
        if 'trigger.new' in q.get('explanation', '').lower() and 'trigger.old' in q.get('explanation', '').lower() and not q.get('codeSnippet'):
            q['codeSnippet'] = """// Trigger.new vs Trigger.old in before update
trigger AccountTrigger on Account (before update) {
    for (Account acc : Trigger.new) {
        Account oldAcc = Trigger.oldMap.get(acc.Id);

        // Check if Industry changed
        if (acc.Industry != oldAcc.Industry) {
            acc.Description = 'Industry changed from ' +
                oldAcc.Industry + ' to ' + acc.Industry +
                ' on ' + System.today();
        }
    }
}"""
            changes += 1
            break

    return changes

def enhance_async_apex_examples(questions: List[Dict]):
    """Add code snippets for future methods and other async patterns."""
    changes = 0

    # Find future method questions
    for idx, q in enumerate(questions):
        if '@future' in q.get('content', '').lower() and not q.get('codeSnippet'):
            q['codeSnippet'] = """// Future method with callout
public class AccountService {

    @future(callout=true)
    public static void callExternalAPI(Set<Id> accountIds) {
        List<Account> accounts = [
            SELECT Id, Name, BillingCity
            FROM Account
            WHERE Id IN :accountIds
        ];

        for (Account acc : accounts) {
            HttpRequest req = new HttpRequest();
            req.setEndpoint('https://api.example.com/verify');
            req.setMethod('POST');
            req.setBody(JSON.serialize(acc));

            Http http = new Http();
            HttpResponse res = http.send(req);

            if (res.getStatusCode() == 200) {
                System.debug('Success for ' + acc.Name);
            }
        }
    }
}

// Call from trigger or Apex
AccountService.callExternalAPI(accountIdSet);"""
            q['explanation'] = """✅ @future methods run asynchronously and support callouts when declared with callout=true. They're ideal for making external API calls without blocking the main transaction. Future methods must be static and can only accept primitive types or collections of primitives.

❌ Queueable Apex is more flexible (accepts complex types, supports chaining) but future methods are simpler for basic async callouts. Batch Apex is for large data volumes, not individual callouts.

💡 Remember: @future(callout=true) is required for HTTP callouts. Without it, you'll get a runtime error."""
            changes += 1
            break

    return changes

def enhance_lwc_examples(questions: List[Dict]):
    """Add more LWC code examples."""
    changes = 0

    # Find Lightning Data Service questions
    for idx, q in enumerate(questions):
        if 'lightning data service' in q.get('content', '').lower() and not q.get('codeSnippet'):
            q['codeSnippet'] = """<!-- LWC using Lightning Data Service -->
<template>
    <lightning-record-form
        record-id={recordId}
        object-api-name="Account"
        fields={fields}
        mode="edit"
        onsubmit={handleSubmit}
        onsuccess={handleSuccess}>
    </lightning-record-form>
</template>

<!-- JavaScript -->
import { LightningElement, api } from 'lwc';

export default class AccountForm extends LightningElement {
    @api recordId;
    fields = ['Name', 'Industry', 'AnnualRevenue', 'Phone'];

    handleSubmit(event) {
        event.preventDefault(); // Stop default submission
        const fields = event.detail.fields;
        fields.AnnualRevenue = '1000000'; // Modify before save
        this.template.querySelector('lightning-record-form').submit(fields);
    }

    handleSuccess(event) {
        const savedRecordId = event.detail.id;
        console.log('Saved record: ' + savedRecordId);
    }
}"""
            changes += 1
            break

    # Find Lightning Message Service questions
    for idx, q in enumerate(questions):
        if 'message service' in q.get('content', '').lower() and 'lightning' in q.get('content', '').lower() and not q.get('codeSnippet'):
            q['codeSnippet'] = """// LWC Publisher using Lightning Message Service
import { LightningElement, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import ACCOUNT_SELECTED from '@salesforce/messageChannel/AccountSelected__c';

export default class AccountPublisher extends LightningElement {
    @wire(MessageContext)
    messageContext;

    handleAccountClick(event) {
        const accountId = event.target.dataset.id;
        const message = {
            accountId: accountId,
            accountName: event.target.dataset.name
        };
        publish(this.messageContext, ACCOUNT_SELECTED, message);
    }
}

// LWC Subscriber
import { subscribe, unsubscribe } from 'lightning/messageService';

export default class AccountSubscriber extends LightningElement {
    subscription = null;

    connectedCallback() {
        this.subscription = subscribe(
            this.messageContext,
            ACCOUNT_SELECTED,
            (message) => this.handleMessage(message)
        );
    }

    handleMessage(message) {
        console.log('Received:', message.accountId);
    }

    disconnectedCallback() {
        unsubscribe(this.subscription);
    }
}"""
            changes += 1
            break

    return changes

def enhance_explanations(questions: List[Dict]):
    """Improve explanations for questions that still lack detail."""
    changes = 0

    # Enhance validation rule explanations
    for idx, q in enumerate(questions):
        explanation = q.get('explanation', '')
        if 'validation rule' in explanation.lower() and len(explanation) < 150:
            q['explanation'] = """✅ Validation rules enforce data quality by preventing record saves that don't meet criteria. They run before records are saved to the database, showing error messages to users. Validation rules can reference fields, user info, and formula functions.

❌ Workflow rules run after save and can't prevent bad data. Triggers can validate, but validation rules are declarative and easier to maintain. Process Builder flows run after save.

💡 Exam tip: Validation rules fire on insert AND update. Use ISNEW() function to only validate on insert, or ISCHANGED() to validate only when a field changes."""
            changes += 1

    # Enhance record type explanations
    for idx, q in enumerate(questions):
        explanation = q.get('explanation', '')
        if 'record type' in explanation.lower() and len(explanation) < 150:
            q['explanation'] = """✅ Record Types control the user experience by determining which page layouts, picklist values, and business processes users see. Different record types on the same object can have completely different fields and workflows, enabling multiple business processes on one object.

❌ Profiles control access but not page layouts per record. Page layouts are assigned to record types. Workflow rules don't control UI elements.

💡 Each record type can have its own page layout assignment and picklist value selections, making them essential for supporting different business units or processes."""
            changes += 1

    return changes

def main():
    filepath = '/Users/igorkudryk/Salesforce/cohorts/pdprep/data/seed/pd1_prep_questions.json'

    print("Loading deduplicated questions...")
    questions = load_questions(filepath)
    print(f"Loaded {len(questions)} questions\n")

    print("Enhancing remaining questions...")

    # Add code snippets
    trigger_changes = enhance_trigger_examples(questions)
    async_changes = enhance_async_apex_examples(questions)
    lwc_changes = enhance_lwc_examples(questions)

    # Improve explanations
    explanation_changes = enhance_explanations(questions)

    total_changes = trigger_changes + async_changes + lwc_changes + explanation_changes

    print(f"\nEnhancements applied:")
    print(f"  - Trigger code snippets: {trigger_changes}")
    print(f"  - Async Apex code snippets: {async_changes}")
    print(f"  - LWC code snippets: {lwc_changes}")
    print(f"  - Enhanced explanations: {explanation_changes}")
    print(f"  - Total questions enhanced: {total_changes}")

    # Count total code snippets now
    total_snippets = sum(1 for q in questions if q.get('codeSnippet'))
    print(f"\nTotal questions with code snippets: {total_snippets}/{len(questions)} ({total_snippets/len(questions)*100:.1f}%)")

    # Save enhanced questions
    print(f"\nSaving to {filepath}...")
    save_questions(questions, filepath)
    print("✅ Enhancement complete!")

if __name__ == '__main__':
    main()
