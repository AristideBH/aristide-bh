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

    // Define the non-breaking space
    const NBSP = '\u00A0';

    // Helper function to apply rules to plain text
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
        formattedText = formattedText.replace(/(\S)\s*—\s*(\S)/g, `$1 ${NBSP}—${NBSP} $2`); // Using NBSP for em-dash
        formattedText = formattedText.replace(/(\S)\s*--\s*(\S)/g, `$1 ${NBSP}--${NBSP} $2`);

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

    // Create a DOM parser
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');

    // Iterate through all text nodes and apply rules
    const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, null);
    let node;
    while ((node = walker.nextNode())) {
        if (node.parentNode && node.parentNode.nodeName !== 'SCRIPT' && node.parentNode.nodeName !== 'STYLE') {
            node.textContent = applyRulesToPlainText(node.textContent || '');
        }
    }

    // Return the serialized HTML
    return doc.body.innerHTML;
};

export const formatText = (input: string): string => {
    if (!input) return '';

    // Add nbsp after colons
    const formattedText = frenchTypoRules(input);

    // Add classes to paragraphs
    const withClasses = addClassesToParagraphs(formattedText, 'lead text-balance');


    return withClasses;
}