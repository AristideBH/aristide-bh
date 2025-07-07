export function addClassesToParagraphs(htmlString: string, classesToAdd: string): string {
    const trimmedClasses = classesToAdd.trim();
    if (!trimmedClasses) return htmlString;

    const classesArray = trimmedClasses.split(/\s+/);

    let result = htmlString.replace(
        /<p(?![^>]*class=)/g,
        `<p class="${trimmedClasses}"`
    );

    return result.replace(
        /<p([^>]*) class="([^"]*)"/g,
        (match, attributes, existingClasses) => {
            const existingClassesArray = existingClasses.split(/\s+/);
            const newClasses = classesArray.filter(cls => !existingClassesArray.includes(cls));

            return newClasses.length === 0
                ? match
                : `<p${attributes} class="${existingClasses} ${newClasses.join(' ')}"`;
        }
    );
}
export const frenchTypoRules = (text: string): string => {
    if (!text) {
        return "";
    }

    const NBSP = '\u00A0';

    // Helper function to apply rules to plain text
    // This function is now simplified and focused purely on text content,
    // without worrying about HTML entities, as DOMParser handles them,
    // and boundary issues will be fixed in the second pass.
    const applyRulesToPlainText = (plainText: string): string => {
        let formattedText = plainText.replace(/\s+/g, ' '); // Normalize spaces

        // Rule: No space before, one space after
        formattedText = formattedText.replace(/(\s*),/g, ', ').replace(/, +/g, ', ');
        formattedText = formattedText.replace(/(\s*)\.\.\./g, '... ').replace(/\.\.\. +/g, '…');
        formattedText = formattedText.replace(/(\s*)\./g, '. ').replace(/\. +/g, '. ');
        formattedText = formattedText.replace(/\s*\)/g, ')');
        formattedText = formattedText.replace(/\s*\]/g, ']');
        formattedText = formattedText.replace(/\s*”/g, '” ').replace(/” +/g, '” ');

        // Specific rule for closing parenthesis/bracket before a point or comma
        formattedText = formattedText.replace(/\)(\s*)(\.|\,)/g, ') $2');
        formattedText = formattedText.replace(/\](\s*)(\.|\,)/g, '] $2');

        // Rule: One space before, no space after
        formattedText = formattedText.replace(/\s*\(/g, ' (');
        formattedText = formattedText.replace(/\s*\[/g, ' [');
        formattedText = formattedText.replace(/\s*“/g, ' “');

        // Rule: One space before, one space after (Em-dash)
        formattedText = formattedText.replace(/(\S)\s*—\s*(\S)/g, `$1${NBSP}—${NBSP}$2`);
        formattedText = formattedText.replace(/(\S)\s*--\s*(\S)/g, `$1${NBSP}--${NBSP}$2`);

        // Rule: Non-breaking space before, one space after
        formattedText = formattedText.replace(/\s*:/g, `${NBSP}: `);
        formattedText = formattedText.replace(/\s*;/g, `${NBSP}; `);
        formattedText = formattedText.replace(/\s*!/g, `${NBSP}! `);
        formattedText = formattedText.replace(/\s*\?/g, `${NBSP}? `);
        formattedText = formattedText.replace(/(\s*)»/g, `${NBSP}» `);
        formattedText = formattedText.replace(/(\d)\s*%/g, `$1${NBSP}% `);

        // Rule: One space before, non-breaking space after
        formattedText = formattedText.replace(/\s*«/g, ` «${NBSP}`);

        // Final cleanup for multiple spaces and trim
        formattedText = formattedText.replace(/\s{2,}/g, ' ');
        return formattedText.trim();
    };

    // Pass 1: Apply rules to text nodes using DOMParser
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');

    const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, null);
    let node;
    while ((node = walker.nextNode())) {
        if (node.parentNode && node.parentNode.nodeName !== 'SCRIPT' && node.parentNode.nodeName !== 'STYLE') {
            // Ensure we don't apply rules to content that's purely whitespace (like &nbsp;)
            // Unless it's a specific non-breaking space that needs to be preserved
            if (node.textContent && node.textContent.trim().length > 0 && node.textContent !== NBSP) {
                node.textContent = applyRulesToPlainText(node.textContent);
            }
        }
    }

    // Get the HTML string after the first pass
    let resultHtml = doc.body.innerHTML;

    // Pass 2: Apply specific regex fixes for spaces around links
    // This is where we ensure spaces are correctly placed relative to HTML tags.

    // Regex to find punctuation immediately followed by </a> without a space
    // and insert a space *after* the closing tag.
    // Example: "Noise,</a>" -> "Noise, </a>"
    resultHtml = resultHtml.replace(/([,.;:!?”\])}])(<\/a>)/g, '$1 $2');
    resultHtml = resultHtml.replace(/([,.;:!?”\])}])\s*(<\/a>)/g, '$1 $2'); // Handle existing space that needs to be outside

    // Regex to find <a> followed by punctuation without a space
    // Example: "</a>." -> "</a> ."
    // This might be less common with your issue, but good for completeness.
    resultHtml = resultHtml.replace(/(<\/a>)([.,;:!?”\])})])/g, '$1 $2');

    // Regex to ensure a space after </a> if followed by text (not punctuation already handled)
    // Example: "</a>The" -> "</a> The"
    resultHtml = resultHtml.replace(/(<\/a>)([a-zA-Z0-9À-ÿ])/g, '$1 $2');

    // Regex to ensure a space before <a if preceded by text (not punctuation or another tag)
    // Example: "text<a" -> "text <a"
    resultHtml = resultHtml.replace(/([a-zA-Z0-9À-ÿ])(<a)/g, '$1 $2');
    resultHtml = resultHtml.replace(/([\])}])(<a)/g, '$1 $2'); // e.g., "(text)<a" -> "(text) <a"

    // Finally, normalize any double spaces that might have been introduced by the regex fixes
    // and trim leading/trailing spaces from the entire HTML string.
    resultHtml = resultHtml.replace(/\s{2,}/g, ' ');
    return resultHtml.trim();
};
export const formatText = (input: string): string => {
    if (!input) return '';

    // Add nbsp after colons
    const formattedText = frenchTypoRules(input);

    // Add classes to paragraphs
    const withClasses = addClassesToParagraphs(formattedText, 'lead text-balance');


    return withClasses;
}