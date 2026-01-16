/* DATA STRUCTURE (unchanged) */
const curriculum = {
  admin: {
    title: "Administrator",
    description: "Config & Security",
    color: "#009EDB",
    modules: [
        {
        id: "admin-m1",
        title: "Module 1: Salesforce Fundamentals",
        description: "Core concepts, Multi-tenant architecture, and Data Model.",
        units: [
          {
            id: "admin-m1-u1",
            title: "The Salesforce Platform",
            type: "theory",
            content: `
# Welcome to Salesforce
Salesforce is a cloud-based CRM platform providing a single view of your customers.

### Key Concepts
* **Multi-tenancy**: Shared infrastructure (building) with private data (apartment).
* **Metadata-Driven**: Data stored separately from customizations.
            `,
            quiz: []
          }
        ]
      }
    ]
  },
  developer: {
    title: "Developer Interview Prep",
    description: "Ace your PD1 & technical interviews.",
    color: "#00CFC8",
    modules: [
      {
        id: "dev-interview-1",
        title: "Apex Fundamentals & Order of Execution",
        description: "Master the transaction lifecycle.",
        units: [
          {
            id: "dev-int-1",
            title: "Order of Execution",
            type: "theory",
            mindmap: `
# Order of Execution
## 1. Init
- Load original record
- Load new record values
## 2. System Validation
- Required fields
- Format checks
## 3. Before Triggers
- Update fields
## 4. Custom Validation
- Validation Rules
## 5. Save
- Record saved to DB (but not committed)
## 6. After Triggers
- Access ID etc.
## 7. Assignment Rules
## 8. Auto-Response
## 9. Workflow Rules
## 10. Process & Flow
## 11. Commit
            `,
            content: `
# Salesforce Order of Execution
Understanding the order of execution is critical for debugging and avoiding recursion.

### The Golden Rules
1. **Validation Rules** run *after* Before Triggers but *before* After Triggers.
2. **System Validation** happens first (e.g., max length, required fields).
3. **Commit** happens last.

### Mnemonics
"Very Big Cats Scratched A White Post"
(Validation, Before, CustomVal, Save, After, Workflow, Process)

\`\`\`java
trigger AccountTrigger on Account (before insert) {
    for(Account a : Trigger.new) {
        a.Description = 'New Description';
    }
}
\`\`\`
            `,
            qa: [
              { q: "What is the order of execution?", a: "1. System Validation, 2. Before Triggers, 3. Custom Validation, 4. Save to DB, 5. After Triggers, 6. Assignment Rules, 7. Workflow/Flow, 8. Commit." },
              { q: "Can you modify a record in an After Trigger?", a: "No, the record is read-only in context. You must perform a DML update." },
              { q: "What happens if a DML error occurs?", a: "The entire transaction is rolled back." }
            ],
            quiz: [{ question: "Which runs first?", options: ["After Triggers", "Validation Rules", "Before Triggers"], correctAnswer: 1, explanation: "Before Triggers run before Custom Validation rules (but after System Validation)." }]
          },
          {
            id: "dev-int-2",
            title: "Governor Limits",
            type: "theory",
            mindmap: `
# Governor Limits
## SOQL
- Sync: 100 queries
- Async: 200 queries
- Rows: 50,000
## DML
- Statements: 150
- Records: 10,000
## CPU Time
- Sync: 10s
- Async: 60s
## Heap Size
- Sync: 6MB
- Async: 12MB
            `,
            content: `
# Governor Limits
Multi-tenancy means resources are shared. Limits prevent one process from monopolizing the CPU.

### Key Limits (Synchronous)
* **SOQL Queries**: 100
* **DML Statements**: 150
* **Total Records Retrieved**: 50,000
* **CPU Time**: 10,000ms (10 seconds)
            `,
             qa: [
              { q: "What is the SOQL query limit?", a: "100 queries for synchronous transactions." },
              { q: "How do you bypass the 50k row limit?", a: "Use a SOQL For Loop or Batch Apex." },
              { q: "What is the heap size limit?", a: "6MB for synchronous, 12MB for asynchronous." }
            ],
            quiz: []
          }
        ]
      },
      {
        id: "top-lwc",
        title: "LWC Interview Questions",
        description: "Lifecycle, Communication, and DOM.",
        units: [
            {
                id: "lwc-1",
                title: "LWC Lifecycle",
                type: "theory",
                mindmap: `
# LWC Lifecycle
## Mount
- constructor()
- connectedCallback()
- render()
- renderedCallback()
## Update
- render()
- renderedCallback()
## Unmount
- disconnectedCallback()
## Error
- errorCallback()
                `,
                content: `
# LWC Lifecycle Hooks
* **constructor()**: Init. Don't access child elements here.
* **connectedCallback()**: Component inserted into DOM. Interact with host.
* **renderedCallback()**: After template is rendered. Careful with infinite loops!
* **disconnectedCallback()**: Removed from DOM. Cleanup listeners.

\`\`\`javascript
import { LightningElement, api } from 'lwc';

export default class Child extends LightningElement {
    @api message;

    connectedCallback() {
        console.log('Connected!');
    }
}
\`\`\`
                `,
                qa: [
                    { q: "When should you call Apex?", a: "In connectedCallback() or via Wire/Getter." },
                    { q: "Can you change props in the child component?", a: "No, props are read-only (@api). Use events to ask parent to change them." }
                ],
                quiz: []
            }
        ]
      }
    ]
  },
  qa: { title: "QA Engineer", description: "Testing Strategies", color: "#FFB700", modules: [] },
  ba: { title: "Analyst", description: "Requirements", color: "#FF5D5D", modules: [] },
  architect: { title: "Architect", description: "System Design", color: "#9059FF", modules: [] }
};


/* APP LOGIC */
document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) lucide.createIcons();
    
    // Toast Container
    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);

    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);

    if (path.includes('dashboard.html')) {
        renderDashboard(params.get('role'));
    } else if (path.includes('module.html')) {
        renderModule(params.get('role'), params.get('module'));
    }
    
    // Intersection Observer for Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    // Observer applied dynamically after render
    window.observeAnimations = () => {
        document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));
    };
});

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const icon = type === 'success' ? 'check-circle' : 'alert-circle';
    const color = type === 'success' ? 'var(--color-success)' : 'var(--color-danger)';
    
    toast.className = \`toast \${type} show\`;
    toast.innerHTML = \`<i data-lucide="\${icon}" style="color:\${color}"></i> <span>\${message}</span>\`;
    lucide.createIcons();
    
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Search Filter
window.filterModules = function(query) {
    const term = query.toLowerCase();
    const cards = document.querySelectorAll('#modules-list > div');
    cards.forEach(card => {
        const title = card.querySelector('h3').innerText.toLowerCase();
        const desc = card.querySelector('p').innerText.toLowerCase();
        if (title.includes(term) || desc.includes(term)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function renderDashboard(roleId) {
    const role = curriculum[roleId];
    if (!role) return document.body.innerHTML = '<div class="container" style="margin-top:2rem"><h1>Role Not Found</h1><a href="index.html" class="btn btn-secondary">Go Home</a></div>';

    document.getElementById('role-title').innerText = role.title;
    document.getElementById('role-desc').innerText = role.description;
    
    const icons = { admin: 'shield', developer: 'code', qa: 'check-circle', ba: 'briefcase', architect: 'layers' };
    const iconContainer = document.getElementById('role-icon-container');
    if (iconContainer) {
        iconContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
        iconContainer.style.color = role.color; 
        iconContainer.innerHTML = \`<i data-lucide="\${icons[roleId] || 'star'}" width="32" height="32"></i>\`;
        lucide.createIcons({ root: iconContainer });
    }

    const list = document.getElementById('modules-list');
    role.modules.forEach((mod, index) => {
        const el = document.createElement('div');
        el.className = \`card animate-in stagger-\${(index % 3) + 1}\`; // Animation Class
        el.style.padding = '1.5rem';
        el.style.cursor = 'pointer';
        el.onclick = () => window.location.href = \`module.html?role=\${roleId}&module=\${mod.id}\`;
        
        el.innerHTML = \`
            <div class="flex justify-between items-center">
                <div>
                   <h3 style="color:#fff; margin-bottom:0.5rem">\${mod.title}</h3>
                   <p style="margin:0; color:var(--text-secondary)">\${mod.description}</p>
                </div>
                <button class="btn btn-secondary">Start</button>
            </div>
        \`;
        list.appendChild(el);
    });
    
    setTimeout(window.observeAnimations, 100);
}

function renderModule(roleId, moduleId) {
    const role = curriculum[roleId];
    const mod = role?.modules.find(m => m.id === moduleId);
    if (!mod) return;

    document.getElementById('module-title-sidebar').innerText = mod.title;
    
    const list = document.getElementById('units-list');
    mod.units.forEach((u, i) => {
        const item = document.createElement('div');
        item.innerText = u.title;
        item.className = 'sidebar-item animate-in'; 
        item.id = \`unit-item-\${i}\`;
        item.onclick = () => loadUnit(roleId, moduleId, i);
        list.appendChild(item);
    });

    loadUnit(roleId, moduleId, 0);
    setTimeout(window.observeAnimations, 100);
}

let editorInstance = null;

function loadUnit(roleId, moduleId, index) {
    const role = curriculum[roleId];
    const mod = role.modules.find(m => m.id === moduleId);
    const unit = mod.units[index];
    if (!unit) return;

    // UI Active State
    document.querySelectorAll('.sidebar-item').forEach((el, i) => {
        if (i === index) el.classList.add('active');
        else el.classList.remove('active');
    });

    document.getElementById('unit-counter').innerText = \`Unit \${index + 1} / \${mod.units.length}\`;
    document.getElementById('unit-title').innerText = unit.title;
    
    // Default to Learn Tab
    switchTab('learn');

    // 1. Render Markdown
    document.getElementById('markdown-content').innerHTML = marked.parse(unit.content);
    
    // Syntax Highlighting & Copy Button
    if (window.Prism) {
        document.querySelectorAll('pre code').forEach((block) => {
            Prism.highlightElement(block);
            
            // Add Copy Button
            const pre = block.parentElement;
            pre.style.position = 'relative';
            const btn = document.createElement('button');
            btn.className = 'btn btn-secondary';
            btn.style.position = 'absolute';
            btn.style.top = '0.5rem';
            btn.style.right = '0.5rem';
            btn.style.padding = '0.2rem 0.5rem';
            btn.style.fontSize = '0.75rem';
            btn.innerText = 'Copy';
            btn.onclick = () => {
                navigator.clipboard.writeText(block.innerText);
                btn.innerText = 'Copied!';
                setTimeout(() => btn.innerText = 'Copy', 2000);
            };
            pre.appendChild(btn);
        });
    }

    // 2. Render Visualization (Mindmap)
    if (window.markmap && unit.mindmap) {
        const transformer = new markmap.Transformer();
        const { root } = transformer.transform(unit.mindmap);
        const mm = markmap.Markmap.create('#markmap', null, root);
        window.currentMarkmap = mm; 
    } else {
        document.getElementById('markmap').innerHTML = ''; 
    }

    // 3. Render Practice (Q&A)
    const qaContainer = document.getElementById('qa-container');
    qaContainer.innerHTML = '';
    if (unit.qa) {
        unit.qa.forEach((qaItem, idx) => {
            const el = document.createElement('div');
            el.className = \`accordion-item animate-in stagger-\${(idx % 3) + 1}\`;
            el.innerHTML = \`
                <div class="accordion-header" onclick="this.parentElement.classList.toggle('active')">
                    \${qaItem.q}
                    <i data-lucide="chevron-down" width="16"></i>
                </div>
                <div class="accordion-content">
                    <p>\${qaItem.a}</p>
                </div>
            \`;
            qaContainer.appendChild(el);
        });
        setTimeout(window.observeAnimations, 100);
    }

    // Quiz
    const quizDiv = document.getElementById('quiz-container');
    quizDiv.style.display = 'none';
    if (unit.quiz && unit.quiz.length) {
        quizDiv.style.display = 'block';
        const q = unit.quiz[0];
        document.getElementById('quiz-content').innerHTML = \`
            <h3 style="margin-bottom:1rem; color:#fff">\${q.question}</h3>
            <div class="flex flex-col gap-2">
                \${q.options.map((o, i) => \`<label style="padding:0.75rem; border:1px solid var(--border-subtle); border-radius:var(--radius-sm); display:block; cursor:pointer;" class="quiz-option"><input type="radio" name="q" value="\${i}"> <span style="margin-left:0.5rem; color:var(--text-secondary)">\${o}</span></label>\`).join('')}
            </div>
            <button class="btn btn-primary" style="margin-top:1rem" onclick="checkQuiz(\${q.correctAnswer})">Submit Answer</button>
        \`;
    }

    // Playground embedded
    const playground = document.getElementById('playground-container');
    playground.innerHTML = ''; 
    if (unit.type === 'code') {
        playground.innerHTML = \`
            <div class="code-playground card-static animate-in">
                <div style="padding:0.5rem 1rem; border-bottom:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center; background: rgba(0,0,0,0.2)">
                    <span style="font-size:0.8rem; font-weight:600; color:var(--text-tertiary)">APEX Playground</span>
                    <button class="btn btn-primary" onclick="runCode()" style="padding:0.25rem 0.75rem; font-size:0.75rem">Run</button>
                </div>
                <div id="monaco-host" style="height: 300px;"></div>
                <div id="playground-output" style="display:none; padding:1rem; background:#0f172a; color:white; font-family:monospace; border-top:1px solid var(--border-subtle)"></div>
            </div>
        \`;
        require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/min/vs' }});
        require(['vs/editor/editor.main'], function() {
            if (editorInstance) editorInstance.dispose();
            const initialCode = (unit.content.match(/\`\`\`(apex|java)\\n([\s\S]*?)\`\`\`/)||[])[2] || '// Code here';
            editorInstance = monaco.editor.create(document.getElementById('monaco-host'), {
                value: initialCode, language: 'java', theme: 'vs-dark', automaticLayout: true, minimap: {enabled: false}
            });
        });
    }

    // Nav Buttons
    const nextBtn = document.getElementById('next-btn');
    nextBtn.innerHTML = index === mod.units.length - 1 ? 'Finish Module <i data-lucide="check" width="16"></i>' : 'Next Unit <i data-lucide="arrow-right" width="16"></i>';
    nextBtn.onclick = () => {
         if (index < mod.units.length - 1) loadUnit(roleId, moduleId, index + 1);
         else window.location.href = \`dashboard.html?role=\${roleId}\`;
    };
    
    lucide.createIcons();
    setTimeout(window.observeAnimations, 100);
}

window.switchTab = function(tabName) {
    document.querySelectorAll('.tab-view').forEach(el => el.style.display = 'none');
    document.getElementById(\`view-\${tabName}\`).style.display = 'block';
    
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(\`tab-\${tabName}\`)?.classList.add('active');

    if (tabName === 'visualize' && window.currentMarkmap) {
        window.currentMarkmap.fit(); 
    }
}

window.runCode = function() {
    if (!editorInstance) return;
    const output = document.getElementById('playground-output');
    output.style.display = 'block';
    output.innerText = '> Running...';
    setTimeout(() => {
        const val = editorInstance.getValue();
        const debug = (val.match(/System\.debug\('(.*?)'\)/)||[])[1];
        if(debug) showToast('Code executed successfully!', 'success');
        output.innerText = debug ? \`> DEBUG|\${debug}\\n> Success\` : '> Success: Executed.';
    }, 600);
}

window.checkQuiz = function(ans) {
     const selected = document.querySelector('input[name="q"]:checked');
     if (!selected) {
         showToast('Please select an option.', 'error');
         return;
     }
     const isCorrect = parseInt(selected.value) === ans;
     
     if(isCorrect) {
         showToast('Correct! Great job.', 'success');
     } else {
         showToast('Incorrect. Try again.', 'error');
     }
}
