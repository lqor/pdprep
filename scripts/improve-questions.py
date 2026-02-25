#!/usr/bin/env python3
"""
Apply Phase 1 content quality improvements to pd1_prep_questions.json:
1. Enhance shortest explanations (< 65 chars)
2. Add code snippets to critical questions
3. Replace PDF URLs with web documentation

Run this after getting approval for which improvements to make.
"""

import json
import sys
from typing import Dict, List

# Improved explanations for the shortest ones
EXPLANATION_IMPROVEMENTS = {
    # Group 8: SOSL (indices 35-39) - Currently 48 chars
    35: {
        "explanation": "✅ SOSL (Salesforce Object Search Language) is designed for text-based searches across multiple objects and fields simultaneously. It returns a list of lists, grouped by object type, making it ideal for global search scenarios like searching 'Acme' across Accounts, Contacts, and Opportunities.\n\n❌ SOQL searches one object at a time (though it can query related objects via relationships). For unrelated objects, you'd need multiple SOQL queries.\n\n💡 Remember: SOSL = Search Over Salesforce across multiple objects; SOQL = Query structured data from one object tree."
    },
    36: {
        "explanation": "✅ SOSL (Salesforce Object Search Language) is the right choice when you need to search text across multiple unrelated objects like Case and Knowledge. It searches all searchable fields and returns results grouped by object type.\n\n❌ SOQL works for one object at a time. You cannot query both Case and Knowledge in a single SOQL query because they don't have a direct relationship.\n\n💡 Exam tip: If the question mentions 'global search' or 'search across multiple objects', think SOSL."
    },
    37: {
        "explanation": "✅ SOSL performs text-based searches across multiple objects simultaneously. When searching for 'Highlander' across Lead and Account, SOSL searches Name, Email, and other searchable fields on both objects in one query.\n\n❌ SOQL would require two separate queries—one for Lead, one for Account—because these objects aren't related. SOSL is more efficient for this use case.\n\n💡 SOSL syntax: FIND {SearchTerm} IN ALL FIELDS RETURNING Lead, Account"
    },
    38: {
        "explanation": "✅ SOSL is optimized for text search across multiple unrelated objects. Searching for 'Spring Promo' across Campaign and Opportunity uses SOSL's full-text search capabilities, which check multiple fields automatically.\n\n❌ SOQL searches one object's fields explicitly. You'd need separate queries for Campaign and Opportunity, then merge results in Apex.\n\n💡 SOSL is faster for text search because it uses Salesforce's search index, not table scans."
    },
    39: {
        "explanation": "✅ SOSL can search across standard objects (Case, Task) and custom objects (Custom_Object__c) in a single query. The RETURNING clause specifies which objects to search, and results are grouped by object type.\n\n❌ SOQL cannot query three unrelated objects in one query. You'd need three separate SOQL statements.\n\n💡 SOSL RETURNING clause example: FIND {Priority} RETURNING Case, Task, Custom_Object__c"
    },

    # Group 36: LWC @api (indices 175-179) - Currently 60 chars
    175: {
        "explanation": "✅ The @api decorator makes a property public and reactive in Lightning Web Components. When the parent component sets recordId, the child component's @api recordId property automatically receives and reacts to changes.\n\n❌ Without @api, the property is private to the component. Using @track is for internal reactive state, not for accepting data from a parent.\n\n💡 Remember: @api = public property that accepts data from parent; @track = private reactive state."
    },
    176: {
        "explanation": "✅ @api decorator exposes a property to parent components. When a parent passes status to a child, the child must declare @api status to receive the value. This is LWC's property binding mechanism.\n\n❌ Regular properties (no decorator) are private. @wire is for calling Apex or reading data, not for accepting parent data.\n\n💡 Syntax: import { LightningElement, api } from 'lwc'; then use @api propertyName in your class."
    },
    177: {
        "explanation": "✅ Use @api to make accountId public and available to parent components. LWC uses decorators for metadata—@api marks properties that can be set from outside the component.\n\n❌ Private properties (no decorator) cannot be accessed by parent components. The parent's template binding would fail silently.\n\n💡 Think of @api as the 'public' keyword in object-oriented programming—it defines the component's public interface."
    },
    178: {
        "explanation": "✅ @api decorator creates a public property that the parent can set via attribute binding. When passing a filter value from parent to child, the child must expose @api filter to receive it.\n\n❌ Without @api, the child component cannot access the parent's data. @wire is for data services, not parent-child communication.\n\n💡 LWC parent-child data flow is one-way: parent passes data down via @api properties; child sends events up."
    },
    179: {
        "explanation": "✅ @api title allows the parent component to pass a title string to the child. This is the standard pattern for component composition in LWC—parent controls child behavior through public properties.\n\n❌ Trying to access a non-@api property from a parent component will not work. The property must be explicitly marked public with @api.\n\n💡 All @api properties are automatically reactive—when the parent changes the value, the child re-renders."
    },

    # Group 11: Formula fields (indices 50-54) - Currently 61 chars
    50: {
        "explanation": "✅ Formula fields calculate values dynamically at runtime, not storing data in the database. For Total_Price__c = Quantity__c * Unit_Price__c, a formula field provides real-time calculation without code or extra storage.\n\n❌ Workflow/Flow would require triggers on every update to recalculate. Formula fields update automatically whenever any referenced field changes.\n\n💡 Formula fields are read-only and don't count against data storage limits. Use them for derived values."
    },
    51: {
        "explanation": "✅ Formula fields are ideal for calculated values like Score__c = Correct__c / Total_c because they automatically recalculate when source fields change. They're read-only and require no code.\n\n❌ A number field would need a trigger or flow to calculate and update the value, adding complexity and maintenance.\n\n💡 Formula field return types must match the calculation: use Number for division, Text for concatenation, etc."
    },
    52: {
        "explanation": "✅ Formula fields like Commission__c = Amount__c * Commission_Rate__c evaluate in real-time based on current field values. They're perfect for business calculations that should always reflect the latest data.\n\n❌ A custom field updated by a trigger would store a snapshot in time, becoming stale if Amount or Rate changes later.\n\n💡 Formula fields support arithmetic, logical, text, and date functions—check the formula function reference for 100+ options."
    },
    53: {
        "explanation": "✅ Formula fields calculate at query time, so Margin__c = Revenue__c - Cost__c always shows the current margin based on current values. No need to worry about updating it when either field changes.\n\n❌ Roll-up summary fields only work on master-detail relationships for aggregating child records, not for calculations on the same record.\n\n💡 Formula fields can reference other formula fields (up to 10 levels deep) for complex calculations."
    },
    54: {
        "explanation": "✅ Formula fields support date functions like TODAY() to calculate Days_Open__c = TODAY() - CreatedDate. The formula recalculates each time the record is viewed, showing current days open.\n\n❌ A number field would need daily updates via scheduled flow or batch Apex to stay current—inefficient and unnecessary.\n\n💡 Common date functions in formulas: TODAY(), NOW(), DATE(), YEAR(), MONTH(), DAY(), DATEVALUE()."
    },
}

# Code snippets to add
CODE_SNIPPET_ADDITIONS = {
    35: """// SOSL searches across multiple objects
List<List<SObject>> searchResults = [
    FIND 'Acme'
    IN ALL FIELDS
    RETURNING Account(Id, Name), Contact(Id, Name), Opportunity(Id, Name)
];

// Results grouped by object type
List<Account> accounts = (List<Account>) searchResults[0];
List<Contact> contacts = (List<Contact>) searchResults[1];
List<Opportunity> opps = (List<Opportunity>) searchResults[2];""",

    36: """// SOSL for global search across unrelated objects
List<List<SObject>> results = [
    FIND 'Contoso'
    IN ALL FIELDS
    RETURNING Case(Id, CaseNumber, Subject), KnowledgeArticleVersion(Id, Title)
];

List<Case> cases = (List<Case>) results[0];
List<KnowledgeArticleVersion> articles = (List<KnowledgeArticleVersion>) results[1];""",

    40: """// Parent-to-child subquery (relationship query)
List<Account> accounts = [
    SELECT Id, Name,
        (SELECT Id, FirstName, LastName, Email FROM Contacts)
    FROM Account
    WHERE Industry = 'Technology'
];

// Access child records
for (Account acc : accounts) {
    for (Contact con : acc.Contacts) {
        System.debug(acc.Name + ' - ' + con.FirstName);
    }
}""",

    41: """// Subquery to get Opportunities with their Line Items
List<Opportunity> opps = [
    SELECT Id, Name, Amount,
        (SELECT Id, Product2.Name, Quantity, UnitPrice FROM OpportunityLineItems)
    FROM Opportunity
    WHERE StageName = 'Closed Won'
];

for (Opportunity opp : opps) {
    System.debug('Opp: ' + opp.Name + ' has ' + opp.OpportunityLineItems.size() + ' products');
}""",

    95: """// Queueable Apex supports complex types and chaining
public class ProcessAccountsQueueable implements Queueable {
    private List<Account> accounts;

    public ProcessAccountsQueueable(List<Account> accts) {
        this.accounts = accts;
    }

    public void execute(QueueableContext context) {
        // Process accounts
        for (Account acc : accounts) {
            acc.Description = 'Processed on ' + System.now();
        }
        update accounts;

        // Chain another job if needed
        if (someCondition) {
            System.enqueueJob(new AnotherQueueable());
        }
    }
}

// Enqueue the job
System.enqueueJob(new ProcessAccountsQueueable(accountList));""",

    100: """// Batch Apex for processing large data volumes
public class AccountBatch implements Database.Batchable<SObject> {

    public Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator('SELECT Id, Name FROM Account');
    }

    public void execute(Database.BatchableContext bc, List<Account> scope) {
        for (Account acc : scope) {
            acc.Description = 'Processed';
        }
        update scope;
    }

    public void finish(Database.BatchableContext bc) {
        System.debug('Batch complete');
    }
}

// Execute batch with scope size
Database.executeBatch(new AccountBatch(), 200);""",

    115: """// Bulkified trigger code (handles collections, not single records)
trigger AccountTrigger on Account (before insert, before update) {
    // GOOD: Bulkified - handles all records in one query
    Set<Id> ownerIds = new Set<Id>();
    for (Account acc : Trigger.new) {
        ownerIds.add(acc.OwnerId);
    }

    Map<Id, User> ownerMap = new Map<Id, User>([
        SELECT Id, Name, Email
        FROM User
        WHERE Id IN :ownerIds
    ]);

    for (Account acc : Trigger.new) {
        User owner = ownerMap.get(acc.OwnerId);
        acc.Owner_Email__c = owner.Email;
    }
}

// BAD: Non-bulkified (would hit governor limits)
// for (Account acc : Trigger.new) {
//     User owner = [SELECT Email FROM User WHERE Id = :acc.OwnerId];
//     acc.Owner_Email__c = owner.Email;
// }""",

    120: """// SOQL FOR loop - memory efficient for large result sets
// Prevents heap size limit by processing in chunks
for (List<Account> accountBatch : [
    SELECT Id, Name, AnnualRevenue
    FROM Account
    WHERE AnnualRevenue > 1000000
]) {
    // Process each batch (up to 200 records per batch)
    for (Account acc : accountBatch) {
        acc.Description = 'High Revenue';
    }
    update accountBatch;
}

// Avoids this (heap size error on 10,000+ records):
// List<Account> allAccounts = [SELECT Id FROM Account]; // Loads all into memory""",

    170: """// Apex class with @AuraEnabled methods for LWC
public with sharing class AccountController {

    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        return [
            SELECT Id, Name, Industry, AnnualRevenue
            FROM Account
            ORDER BY Name
            LIMIT 50
        ];
    }

    @AuraEnabled
    public static void updateAccount(Id accountId, String newName) {
        Account acc = [SELECT Id FROM Account WHERE Id = :accountId];
        acc.Name = newName;
        update acc;
    }
}""",

    185: """// LWC calling Apex imperatively
import { LightningElement } from 'lwc';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';

export default class AccountList extends LightningElement {
    accounts;
    error;

    connectedCallback() {
        this.loadAccounts();
    }

    loadAccounts() {
        getAccounts()
            .then(result => {
                this.accounts = result;
                this.error = undefined;
            })
            .catch(error => {
                this.error = error;
                this.accounts = undefined;
            });
    }
}""",

    195: """// LWC NavigationMixin for record navigation
import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class NavigateToRecord extends NavigationMixin(LightningElement) {

    handleNavigate(event) {
        const accountId = event.target.dataset.recordId;

        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: accountId,
                objectApiName: 'Account',
                actionName: 'view'
            }
        });
    }
}""",
}

# URL replacements (PDF -> web docs)
URL_REPLACEMENTS = {
    "https://resources.docs.salesforce.com/latest/latest/en-us/sfdc/pdf/salesforce_data_loader.pdf":
        "https://help.salesforce.com/s/articleView?id=sf.data_loader.htm",

    "https://resources.docs.salesforce.com/latest/latest/en-us/sfdc/pdf/salesforce_apex_developer_guide.pdf":
        "https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/",
}

def load_questions(filepath: str) -> List[Dict]:
    """Load questions from JSON file."""
    with open(filepath, 'r') as f:
        return json.load(f)

def save_questions(questions: List[Dict], filepath: str):
    """Save questions to JSON file with pretty formatting."""
    with open(filepath, 'w') as f:
        json.dump(questions, f, indent=2)

def apply_improvements(questions: List[Dict], apply_explanations=True, apply_snippets=True, apply_urls=True):
    """Apply specified improvements to questions."""
    changes = {
        'explanations': 0,
        'snippets': 0,
        'urls': 0
    }

    for idx, question in enumerate(questions):
        # Apply explanation improvements
        if apply_explanations and idx in EXPLANATION_IMPROVEMENTS:
            question['explanation'] = EXPLANATION_IMPROVEMENTS[idx]['explanation']
            changes['explanations'] += 1

        # Apply code snippets
        if apply_snippets and idx in CODE_SNIPPET_ADDITIONS:
            question['codeSnippet'] = CODE_SNIPPET_ADDITIONS[idx]
            changes['snippets'] += 1

        # Apply URL replacements
        if apply_urls and question.get('referenceUrl') in URL_REPLACEMENTS:
            question['referenceUrl'] = URL_REPLACEMENTS[question['referenceUrl']]
            changes['urls'] += 1

    return changes

def main():
    filepath = '/Users/igorkudryk/Salesforce/cohorts/pdprep/data/seed/pd1_prep_questions.json'

    print("Loading questions...")
    questions = load_questions(filepath)
    print(f"Loaded {len(questions)} questions\n")

    # Apply improvements
    print("Applying Phase 1 improvements...")
    changes = apply_improvements(
        questions,
        apply_explanations=True,
        apply_snippets=True,
        apply_urls=True
    )

    print(f"\nChanges applied:")
    print(f"  - Enhanced explanations: {changes['explanations']}")
    print(f"  - Added code snippets: {changes['snippets']}")
    print(f"  - Updated URLs: {changes['urls']}")
    print(f"  - Total questions modified: {changes['explanations'] + changes['snippets'] + changes['urls']}")

    # Save updated questions
    print(f"\nSaving to {filepath}...")
    save_questions(questions, filepath)
    print("✅ Done!")

if __name__ == '__main__':
    main()
