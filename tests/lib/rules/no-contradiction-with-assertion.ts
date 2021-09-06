import { RuleTester } from "eslint"
import rule from "../../../lib/rules/no-contradiction-with-assertion"

const tester = new RuleTester({
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
    },
})

tester.run("no-contradiction-with-assertion", rule as any, {
    valid: [
        // Ignore trivially accepting/rejecting assertions
        String.raw`/a\ba/`,
        String.raw`/(?!)a/`,
        String.raw`/(?=)a/`,
        String.raw`/$a/`,

        // Other valid regexes
        String.raw`/(^|[\s\S])\bfoo/`,
        String.raw`/(?:aa|a\b)-?a/`,
    ],
    invalid: [
        {
            code: String.raw`/a\b-?a/`,
            errors: [
                {
                    messageId: "alwaysEnterQuantifier",
                    suggestions: [{ output: String.raw`/a\b-{1}a/` }],
                },
            ],
        },
        {
            code: String.raw`/a\b(a|-)/`,
            errors: [
                {
                    messageId: "alternative",
                    suggestions: [],
                },
            ],
        },
        {
            code: String.raw`/a\ba*-/`,
            errors: [
                {
                    messageId: "cannotEnterQuantifier",
                    suggestions: [{ output: String.raw`/a\b-/` }],
                },
            ],
        },

        {
            code: String.raw`/(^[\t ]*)#(?:comments-start|cs)[\s\S]*?^[ \t]*#(?:comments-end|ce)/m`,
            errors: [
                {
                    messageId: "alwaysEnterQuantifier",
                    suggestions: [
                        {
                            output: String.raw`/(^[\t ]*)#(?:comments-start|cs)[\s\S]+?^[ \t]*#(?:comments-end|ce)/m`,
                        },
                    ],
                },
            ],
        },
    ],
})
