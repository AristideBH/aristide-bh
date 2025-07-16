<script lang="ts">
	import { Cookie } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import * as CookieConsent from 'vanilla-cookieconsent';
	import 'vanilla-cookieconsent/dist/cookieconsent.css';

	const config: CookieConsent.CookieConsentConfig = {
		categories: {
			necessary: {
				enabled: true,
				readOnly: true
			},
			analytics: {
				autoClear: {
					cookies: [
						{
							name: /^_ga/ // regex: match all cookies starting with '_ga'
						},
						{
							name: '_gid' // string: exact cookie name
						}
					]
				},

				// https://cookieconsent.orestbida.com/reference/configuration-reference.html#category-services
				services: {
					ga: {
						label: 'Google Analytics',
						onAccept: () => {},
						onReject: () => {}
					}
				}
			}
		},

		onFirstConsent: ({ cookie }) => {
			// console.log('onFirstConsent fired', cookie);
		},

		onConsent: ({ cookie }) => {
			// console.log('onConsent fired!', cookie, CookieConsent.getUserPreferences());
		},

		onChange: ({ changedCategories, changedServices }) => {
			// console.log('onChange fired!', changedCategories, changedServices);
		},

		onModalReady: ({ modalName }) => {
			// console.log('ready:', modalName);
		},

		onModalShow: ({ modalName }) => {
			// console.log('visible:', modalName);
		},

		onModalHide: ({ modalName }) => {
			// console.log('hidden:', modalName);
		},

		guiOptions: {
			consentModal: {
				layout: 'box inline',
				position: 'top right',
				equalWeightButtons: true,
				flipButtons: true
			},
			preferencesModal: {
				layout: 'box',
				equalWeightButtons: true,
				flipButtons: false
			}
		},

		language: {
			default: 'fr',
			translations: {
				fr: {
					consentModal: {
						title: '🍪 Ce site utilise des cookies',
						description:
							'En acceptant, vous consentez à l’utilisation de cookie pour optimiser votre expérience de navigation. Vous pouvez modifier vos préférences ou retirer votre consentement à tout moment.',
						acceptAllBtn: 'Tout accepter',
						acceptNecessaryBtn: 'Tout refuser',
						showPreferencesBtn: 'Gérer les préférences',
						// closeIconLabel: 'Reject all and close modal',
						footer: `
							<a href="/mentions-legales" >Mentions légales</a>
							<a href="/confidentialite" >Politique de confidentialité</a>
					`
					},
					preferencesModal: {
						title: 'Gérer les préférences',
						acceptAllBtn: 'Tout accepter',
						acceptNecessaryBtn: 'Tout refuser',
						savePreferencesBtn: 'Accepter et enregistrer',
						closeIconLabel: 'Fermer',
						serviceCounterLabel: 'Service|Services',
						sections: [
							{
								title: 'Vos préférences de confidentialité',
								description: `In this panel you can express some preferences related to the processing of your personal information. You may review and change expressed choices at any time by resurfacing this panel via the provided link. To deny your consent to the specific processing activities described below, switch the toggles to off or use the “Reject all” button and confirm you want to save your choices.`
							},
							{
								title: 'Nécessaires',
								description:
									'Ces cookies sont indispensables au bon fonctionnement du site et ne peuvent pas être désactivés. Ils sont généralement définis en réponse à des actions effectuées par vous, comme la définition de vos préférences de confidentialité, la connexion ou le remplissage de formulaires.',

								//this field will generate a toggle linked to the 'necessary' category
								linkedCategory: 'necessary'
							},
							{
								title: 'Performances et analyses',
								description:
									"Ces cookies collectent des informations sur votre utilisation de notre site web, et me permettent d'optimiser son fonctionnement de manière informée. Toutes les données sont anonymisées et ne peuvent pas être utilisées pour vous identifier.",
								linkedCategory: 'analytics',
								cookieTable: {
									caption: 'Données',
									headers: {
										name: 'Cookie',
										domain: 'Domaine',
										desc: 'Description'
									},
									body: [
										{
											name: '_ga',
											domain: 'yourdomain.com',
											desc: 'Description 1'
										},
										{
											name: '_gid',
											domain: 'yourdomain.com',
											desc: 'Description 2'
										}
									]
								}
							},
							// {
							// 	title: 'Targeting and Advertising',
							// 	description:
							// 		'These cookies are used to make advertising messages more relevant to you and your interests. The intention is to display ads that are relevant and engaging for the individual user and thereby more valuable for publishers and third party advertisers.',
							// 	linkedCategory: 'ads'
							// },
							{
								title: 'Informations complémentaires',
								description:
									'Pour toute question relative à la gestion en matière de cookies, veuillez <a href="#contact-page">me contacter</a>.'
							}
						]
					}
				}
			}
		}
	};

	/**
	 * Only run plugin on the client side
	 */
	onMount(() => {
		CookieConsent.run(config);
		// CookieConsent.showPreferences();
	});
</script>
