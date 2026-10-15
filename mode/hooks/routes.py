# One row per principle: the moment the model is told it hit, the prompt cues, and
# (for tool moments) which tool event names it. A strong cue scores 2, a weak cue 1;
# a principle is named at 2 or more, so one generic word ("add", "ticket", "users")
# never fires on its own. Ties keep table order; at most MAX_ROUTED are named.
ROUTES = [
    {"p": "attack-the-premise",
     "moment": "fixes that share one premise keep failing the same check",
     "strong": [r"(?=.*\b(tried|after|both|two|second|another|then)\b)(?=.*\b(still|again|keeps?|same)\b.{0,40}\b(fail\w*|broken|break\w*|crash\w*|flak\w*|off|wrong))",
                r"\bdidn'?t (help|work|fix)\b",
                r"\b(second|another|third|yet another) (fix|attempt|try|workaround|patch)\b"],
     "weak": [r"\b(after|despite) (we|i) \w+", r"\bsame (check|error|failure|test)\b"]},
    {"p": "explain-the-number",
     "moment": "a measured number is about to be trusted or reported",
     "strong": [r"\d+(\.\d+)?\s?(x|×|%)\s?(faster|slower|quicker|speed\w*|improv\w*|better|worse)",
                r"(?=.*\d)(?=.*\b(bench\w*|latency|throughput|speed ?up|regress\w*|p9\d|qps|rps|ops/s)\b)",
                r"(?=.*\d(\.\d+)?\s?(%|x|ms|mb|gb)(?!\w))(?=.*\b(measur\w*|memory|cpu|dropped|faster|slower)\b)"],
     "weak": [r"\b(bench\w*|measured|timings?|faster|slower|profil\w*)\b"],
     "tool": "bench-run", "before": "Before you trust, report, or act on a number from that run"},
    {"p": "separate-before-serializing-shared-state",
     "moment": "more than one actor writes the same thing",
     "strong": [r"\b(two|multiple|several|both|concurrent|parallel) (workers?|processes|threads|agents|jobs|writers|sessions)\b",
                r"\bboth (write|append|update|edit|push)\w*",
                r"\b(race conditions?|concurren\w*|simultaneous\w*|mutex)\b"],
     "weak": [r"\b(same|shared|single) (file|branch|key|row|record|table|state)\b", r"\b(parallel|lock\w*|append\w*)\b"]},
    {"p": "make-operations-idempotent",
     "moment": "a job or command must survive crashes and reruns",
     "strong": [r"\b(idempot\w*|halfway|half-way|partway|re-?runs?|re-?running|resum\w* (after|from)|runs? twice)\b",
                r"\b(job|sync|loop|step|script|worker|task)\b.{0,60}\b(crash\w*|restart\w*|interrupt\w*|dies)\b",
                r"\b(crash\w*|restart\w*|interrupt\w*)\b.{0,60}\b(job|sync|loop|step|script|worker|task)\b"],
     "weak": [r"\b(nightly|cron|sync\w*|jobs?|retr(y|ies)|restarts?|crash\w*|webhooks?|backfill\w*|queue)\b"]},
    {"p": "migrate-callers-then-delete-legacy-apis",
     "moment": "a new API replaces an old one that still has callers",
     "strong": [r"(?=.*(\b(old|legacy|deprecated|new (api|one|version|function))\b|\b\w*_?v\d+\b))(?=.*\b(callers?|call sites?|still calls?|switch\w* (\w+ )?over|migrat\w*))",
                r"\b(still has callers|old callers|existing callers)\b"],
     "weak": [r"\b(old|legacy|deprecated|replac\w*|retire)\b"]},
    {"p": "model-the-domain",
     "moment": "stateful logic, or a lifecycle with states and transitions",
     "strong": [r"\b(state machine|lifecycle|life cycle|moves? through|transitions?|workflow states?)\b",
                r"\bfrom [\w ]{1,20} to [\w ]{1,20} to\b",
                r"\b(lots of|too many|scattered) (if|conditionals|flags|booleans)\b"],
     "weak": [r"\b(states|status(es)?|draft|stages?|pending|submitted|paid|shipped|cancel\w*)\b",
              r"\b(design|model|sketch|represent)\b"]},
    {"p": "fix-root-causes",
     "moment": "a defect to trace to its cause",
     "strong": [r"\b(bugs?|root cause|flaky|regress(ion|ed)|traceback|exceptions?|crash(es|ed|ing)|off.by.one|debug\w*)\b",
                r"\b(reports?|returns?|shows?|prints?|gives?|counts?) \d",
                r"\b(doesn'?t|does not|isn'?t|not) work(ing)?\b", r"\bfix (it|this|that)\b"],
     "weak": [r"\b(fail(s|ed|ing|ure)?|broken|wrong|incorrect|errors?|unexpected)\b", r"\bfix\w*\b"]},
    {"p": "subtract-before-you-add",
     "moment": "adding to code that carries dead weight",
     "strong": [r"\b(unused|dead code|never[- ](call|use)\w*|no longer (used|called)|obsolete|leftover|cruft)\b"],
     "weak": [r"\b(legacy|stale|refactor\w*|rewrite|clean ?up|remove|delete)\b"]},
    {"p": "sequence-verifiable-units",
     "moment": "multi-step work, or how commits and PRs stack",
     "strong": [r"\bmigrat\w*", r"\bcall sites?\b", r"\b\d+ (files|callers|places|services|repos|modules|tickets)\b", r"\b(all|every) \d+ \w+",
                r"\b(sweep|roll ?out|stacked prs?|stack of (prs|commits))\b"],
     "weak": [r"\b(plan|phases|steps|step[- ]by[- ]step|incremental\w*|one at a time)\b"]},
    {"p": "boundary-discipline",
     "moment": "validation or error handling at an edge",
     "strong": [r"\b(validat\w*|reject\w*|sanitiz\w*|malformed|untrusted|user input|error handling|handle errors?)\b",
                r"\b(isn'?t|is not|not) an? (number|integer|string|date|valid)\b"],
     "weak": [r"\b(pars\w*|inputs?|config|cli|csv|json|external api|stdin)\b"]},
    {"p": "minimize-reader-load",
     "moment": "code someone has to read and trace",
     "strong": [r"\bexplain how\b", r"\bhow (does|do) .{0,40}work", r"\bwalk .{0,20}through\b",
                r"\b(new (teammate|hire|engineer|contributor)|onboard\w*|hard to (follow|read|trace)|confusing)\b"],
     "weak": [r"\b(explain|readab\w*|briefly|overview|review)\b"]},
    {"p": "experience-first",
     "moment": "a product, UX, or scope tradeoff",
     "strong": [r"\b(people who use|users? (see|would|will|get|expect|want|need)|users?'?s? (side|perspective|point of view)|user[- ]facing|customer[- ]facing|user experience|ux)\b",
                r"\bis (that|this) the right (call|choice|thing)\b"],
     "weak": [r"\b(users?|customers?)\b", r"\b(page|screen|button|dialog|error messages?|wording|ui)\b",
              r"\b(simplest|good enough|scope|mvp|(right|wrong) call)\b"]},
    {"p": "test-behavior-not-implementation",
     "moment": "a test to write, change, or keep",
     "strong": [r"\b(write|add|create|update|change|keep|delete|remove|fix)\w* (a |an |the |some |more )?(unit |integration |e2e |regression )?tests?\b",
                r"\b(test coverage|mock\w*|fixtures?|assert\w*|tdd)\b"],
     "weak": [r"\btests?\b"],
     "tool": "test-edit", "before": "That edit touches a test. Before the next test edit"},
    {"p": "type-system-discipline",
     "moment": "designing types or a signature",
     "strong": [r"\b(type (signature|system|design)|types for|illegal states?|unrepresentable|discriminated|branded|newtype|typescript|mypy)\b"],
     "weak": [r"\b(types?|typed|signatures?|enums?|interfaces?|generics?)\b"]},
    {"p": "encode-lessons-in-structure",
     "moment": "a correction that keeps recurring",
     "strong": [r"\b(keeps? (happening|forgetting|doing|breaking|missing)|every time|same mistake|(told|asked) you (before|already|twice)|from now on|stop doing)\b"],
     "weak": [r"\b(again|forgot|remind\w*)\b"]},
    {"p": "exhaust-the-design-space",
     "moment": "a decision with no precedent to copy",
     "strong": [r"\b(which (approach|design|option)|alternatives|trade-?offs?|prototypes?|compare (approaches|designs)|no precedent|not sure (how|which))\b"],
     "weak": [r"\b(compare|choose|decide|approach|options?)\b"]},
    {"p": "outcome-oriented-execution",
     "moment": "a planned rewrite or migration with phases",
     "strong": [r"\b(cut ?over|intermediate states?|compat(ibility)? (layer|shim)|shims?|backwards? compat\w*|phased|in phases)\b"],
     "weak": [r"\b(rewrite|migrat\w*|phases?|transition\w*)\b"]},
    {"p": "redesign-from-first-principles",
     "moment": "a new requirement entering an existing design",
     "strong": [r"\b(new requirement|now (needs|must|has) to|retrofit\w*|bolt\w* (it )?on)\b",
                r"\badd(ing)? .{0,40}\bsupport\b"],
     "weak": [r"\b(multi-\w+|extend\w*|integrat\w*|existing (design|code|module))\b"]},
    {"p": "foundational-thinking",
     "moment": "choosing core types and data structures before logic",
     "strong": [r"\b(data (structure|model|shape)s?|schema|core types?|from scratch|greenfield|scaffold\w*|new (service|module|system))\b"],
     "weak": [r"\b(design|sketch|shape|structure)\b", r"\bbefore (we|i) (write|build|code)\b"]},
    {"p": "build-the-lever",
     "moment": "work worth a script, codemod, or generator",
     "strong": [r"\b(\d{2,}|every|all) (the )?(call sites?|files|places|occurrences|callers|tickets|repos|services)\b",
                r"\b(codemod|bulk|by hand|repo-?wide|codebase-?wide|census)\b"],
     "weak": [r"\b(count|analy[sz]e|each|repetitive|tedious)\b"]},
    {"p": "guard-the-context-window",
     "moment": "bulk output that would fill the context",
     "strong": [r"\b(huge|large|long|massive) (file|log|output|dump|diff)\b",
                r"\b(whole (repo|codebase|history)|every file in|fan[- ]?out|context window)\b"],
     "weak": [r"\b(dump|entire|all of)\b"],
     "tool": "big-output", "before": "That output was large. Before the next large read"},
    {"p": "never-block-on-the-human",
     "moment": "work the user handed over to run without them",
     "strong": [r"\b(don'?t ask|just do it|without asking|going to bed|run until done|use your (own )?judgment|keep going|decide (it )?yourself)\b"],
     "weak": []},
    {"p": "prove-it-works",
     "moment": "a done condition, or a claim that work is done",
     "strong": [r"\b(write|file|draft|create|open)\b.{0,30}\btickets?\b",
                r"\b(done condition|acceptance criteria|make sure (it|this) works|verify (it|that|this)|before (we|i) (ship|merge))\b"],
     "weak": [r"\btickets?\b", r"\b(ship\w*|release\w*|dry[- ]run|works?)\b"],
     "tool": "unverified-edit"},
    {"p": "laziness-protocol",
     "moment": "sizing a change before writing it",
     "strong": [r"\b(keep it (simple|small|minimal)|minimal|smallest (change|diff|fix)|over-?engineer\w*|abstractions?|refactor\w*)\b"],
     "weak": [r"\b(simple|small|quick|add(s|ing)?|implement\w*|helpers?|wrappers?|layers?)\b"]},
]

# The start of heavy work: a plan, an investigation, or writing for someone else. The
# prompt hook treats plan mode, or any of these cues, as that moment and asks for every
# principle the work could reach, not only the next step's. Starting one of the heavy
# workflow skills counts too. Paths and links are stripped before matching, so a folder
# named for a design doesn't count; a leading slash, as in /blueprint, is kept.
HEAVY = [r"\b(investigat\w*|deep[- ]?dive|go deep|audit\w*|research\w*|post-?mortem|retrospective|reflection|mining)\b",
         r"\b(plan|design|architect|spec out)\s+(how|what|which|the|a|an|our|out)\b",
         r"\b(write|draft|prepare|put together)\b.{0,30}\b(up|brief|proposal|rfc|report|memo|explainer|post|announcement)\b",
         r"\bfor (the|our|a|my) (team|teammates?|product|leadership|stakeholders|reviewers?|manager|customers?)\b",
         r"(^|\s)[/$](blueprint|research|explainer|grilling|how|why|arena)\b"]

# Operational rules, said in one line just before the action they govern. Each points
# to where the full rule lives. "every" reminders fire on each action; the rest once per
# task, until the next user prompt.
OPS = {
    "helper": {"every": False,
               "builtin": "This session runs in Herdr: start this helper as a scratch agent, as the `scratch-agents` "
                          "skill says, with the model and effort from its role table (global agent rules, Before you "
                          "change things).",
               "unnamed": "Name the model and effort in this start command, from the `scratch-agents` role table "
                          "(global agent rules, Before you change things)."},
    "outside-write": {"every": True,
                      "text": "This call writes to an outside system. Write only through the connector the project's "
                              "docs or skills name, after its approval steps, and only inside what the user asked for "
                              "(global agent rules, Tools; this repo's AGENTS.md)."},
    "merge": {"every": True,
              "text": "Merge on the user's word: go ahead only when the user said merge for this work; otherwise "
                      "report the PR as ready and stop (global agent rules, Git; this repo's AGENTS.md may add a "
                      "gate)."},
    "delete": {"every": True,
               "text": "Before this delete, state its blast radius, what it removes, and wait for the user's yes "
                       "(global agent rules, Working habits).",
               "unresolved": "Resolve the variable or wildcard to literal paths, then state the blast radius, what it "
                             "removes, and wait for the user's yes (global agent rules, Working habits)."},
    "stash": {"every": True,
              "text": "Keep in-progress work on a branch or in a commit; stash only when the user names it (global "
                      "agent rules, Git)."},
    "commit": {"every": False,
               "text": "Check `git status`, stage only the files you changed this session, by name, keep secrets out, "
                       "and use a conventional prefix (global agent rules, Git; this repo's AGENTS.md may set its own "
                       "landing rule)."},
    "shell-script": {"every": False,
                     "text": "Quote every variable and run `shellcheck` on this script before calling it done (global "
                             "agent rules, Shell scripts)."},
    "agent-doc": {"every": False,
                  "text": "This edits a document agents read. Before the first edit, load the `writing-for-agents` "
                          "skill and every `principle-*` skill this change could reach, and follow them in the edit "
                          "(working mode). In `~/src/skills`, run `scripts/check-skills` before committing."},
}
HELPER_TOOLS = ("Agent", "Task", "spawn_agent")
WRITE_VERBS = ("create", "update", "delete", "remove", "send", "post", "edit", "write", "insert", "append", "archive",
               "upload", "capture", "record", "patch", "put", "move")
