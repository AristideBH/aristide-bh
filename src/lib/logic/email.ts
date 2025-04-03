export const handleContact = (mail: string) => {
    const mailSubject = '[> aristide-bh.com]';
    var mailBody = 'Bonjour Aristide,\n';
    const emailLink = document.createElement('a');
    emailLink.setAttribute('target', '_blank');
    emailLink.setAttribute(
        'href',
        `mailto:${mail}?Subject=${mailSubject}&body=${encodeURIComponent(mailBody)}`
    );
    emailLink.click();
};