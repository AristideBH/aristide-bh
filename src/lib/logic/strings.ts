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