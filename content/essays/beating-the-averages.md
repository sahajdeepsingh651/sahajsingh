---
title: 'My views on "Beating the Averages" by Paul Graham'
date: "2025-06-26"
description: "On Lisp, homoiconicity, macros, and why expressive languages offer an asymmetric competitive advantage."
originalUrl: "https://medium.com/@sahajdeepsingh100/my-views-on-beating-the-averages-by-paul-graham-f6320333ef0f"
status: finished
confidence: highly_likely
modifications:
  - date: "2025-06-26"
    note: "Original essay drafted and published on Medium."
  - date: "2026-09-21"
    note: "Migrated to personal field notebook; added epistemic status, confidence, and code block formatting."
references:
  - id: 1
    title: "Beating the Averages"
    author: "Paul Graham"
    url: "https://paulgraham.com/avg.html"
    date: "2001"
    note: "Original essay on Lisp, macros, and competitive startup technology."
  - id: 2
    title: "Recursive Functions of Symbolic Expressions and Their Computation by Machine, Part I"
    author: "John McCarthy"
    url: "https://dl.acm.org/doi/10.1145/367177.367199"
    date: "1960"
    note: "The landmark paper introducing Lisp and homoiconicity."
---

Read his essay if you haven't: [Beating the Averages](https://paulgraham.com/avg.html)[^1]

## You Don't Beat the Average by Playing It Safe
If you want to gain a substantial advantage over your competitors, you need to do something different. This whole point will be emphasized more by telling you guys more about the startup "Viaweb".

## Viaweb
Viaweb was originally started by Paul Graham and Robert Morris. Trevor Blackwell joined them later. It rendered websites dynamically on the server, unlike typical client-side approaches of the time. This approach removed the dependency on the client-side tech stack, allowing them to use any language they preferred.

## The Blub Paradox
Paul introduces the Blub paradox that explains that a normal programmer will not know what features he is missing, since he is thinking the whole software in his own programming language. He won't understand the power of macros or what features he is missing that make software more useful and elegant that can be achieved by adopting some other language.

## Why Lisp ? why go to some uncharted Land of Lisp?
Lisp (short for LISt Processing) is one of the oldest high-level programming languages, invented by John McCarthy in 1958[^2].

## Why to use Lisp

### Code as Data
In Lisp, code is written using the same structures that are used for regular data. This idea is called homoiconicity.

Homoiconic means the primary representation of code is also a data structure in the language itself.

So in Lisp:
- Code is data
- And data can be used as code

In Lisp, code and data both are represented using an Abstract Syntax Tree (AST). This allows code to be passed as an argument — which introduces the concept of macros. Since code is written in AST, you don't need a parser to parse your code, which you would need in other languages.

You don't need a separate mechanism to handle code.

The same tools you use for data — like `car`, `cdr`, `list`, `subst`, `mapcar` — can be used to inspect, transform, and generate code.

## Example 1: If Statement

**As Code**
```lisp
(if (> x 0)
    (print "positive")
    (print "non-positive"))
```

**As Data (Quoted List)**
```lisp
'(if (> x 0)
      (print "positive")
      (print "non-positive"))
```

The only difference in syntax is the presence of the ' (quote), which tells Lisp to treat the expression as data rather than executing it.

Since Code and data are treated as same. You can pass code as arguments from there concept of macros has come

## Macros
**Macros are powerful tools using which you can generate code from code!!**

Yes, generating code from code seems like a weird idea.

```lisp
;THIS is the macros for creating unless control structure

(defmacro unless (condition body)
  `(if (not ,condition)
       ,body))
```

The `unless` macro takes a condition and a body of code, and expands into an `if` statement that runs the body only if the condition is false—in other words, "do this unless the condition is true."

This block of code may seem just like a function — you take some arguments and you get some value in return — but it's different. You are passing Code in the arguments and getting code as output which will replace macro in compiler phase

```lisp
;block a
(unless (> x 10)
 (print "x is not greater than 10"))
```

```lisp
;block b
(if (not (> x 10))
 (print "x is not greater than 10"))
```

block a code will be replaced by block b code in the compiler phase.

## Macro vs Function in Lisp
- A **function** *evaluates* all its arguments before executing.
- A **macro** works at the **code level**: it gets the **code itself** (unevaluated), and returns new code to run.

For example:
```lisp
function(x>0 ,do_something,do_something_else)
```

In this function, all arguments(x>0 ,do_something,do_something_else) get executed, even if you need them or not.

So the ability to control your execution can introduce new control flow in the program.

If you look at the "unless" macro, it is just `if` and `not` combined together — this can be achieved in other languages also.

But **things like changing the execution depending on how many times a block of code has run** can be done, which can't be done naturally in other languages.

In Lisp, you are **transforming code before it runs**.

In future, I will go more deeply into how Lisp is different from other languages.

I'll dive deeper into these macro patterns — like **backtracking, reactive triggers, and coroutines** — in upcoming sections, which are difficult to express together in most conventional programming languages without building complex frameworks or interpreters.

**Things which are unique to one language can be created in Lisp**, that is why Lisp is called *"a language that can create other languages."*

## So I will summarize Macros:
> **_Macros are powerful tools that generate and manipulate code in compile time — meaning you are writing code in the compile-time phase._**

## Why is it not so widely used?
Learning a new programming language is learning a **new way to think** about the solution of problems. Each programming language comes with its own way to think — which we can call a **programming paradigm**

(I will explain programming paradigms more extensively in my coming blogs).

Programming revolution and hardware revolution have not grown at the same rate of growth. It takes time to change habits of mind.

## The Strategic Advantage and Disadvantage

### Advantage
The advantage is your competitor won't understand how you are developing your software so fast.

This is evident in Paul's essay when he was talking about his startup days.

They were able to copy competitors' features within **days only**.

> *(Note — I still have to understand more about Lisp — what more you can do instead of developing your own domain-specific language and building complex dynamic systems fast.)*

### Disadvantage
It is difficult to find programmers who still use Lisp, since it is the **second-oldest high-level programming language** still in use today (after **Fortran**).

This makes collaboration with others more challenging.
