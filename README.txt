meshfreehernia.org - wdrozenie (Cloudflare Pages)

1. Nowe repozytorium GitHub (np. meshfreehernia), w katalogu glownym: index.html oraz functions/api/kontakt.js (zachowaj strukture folderow).
2. Cloudflare -> Workers & Pages -> Create -> Pages -> Connect to Git -> to repozytorium. Build command: (puste), Output directory: / (puste lub "."), Framework: None.
3. Settings -> Variables and Secrets (Production):
   RESEND_API_KEY (Secret) = ten sam klucz co w przepuklinabezsiatki-static
   MAIL_TO  = s.dabrowiecki@outlook.com
   MAIL_FROM = formularz@przepuklinabezsiatki.pl
   Potem: Deployments -> najnowsze -> Retry deployment.
4. Custom domains -> dodaj meshfreehernia.org (i www.meshfreehernia.org).
5. meshfreehernia.co.uk: Rules -> Redirect Rules -> 301 na https://meshfreehernia.org (zachowaj sciezke).
6. Test: wyslij formularz na https://meshfreehernia.org i sprawdz skrzynke (temat "English page enquiry: ...").
Klucza API nie wpisuj do plikow w repozytorium.

Turnstile (anti-spam): create a widget in Cloudflare (Turnstile), put the Site Key in index.html (TS_KEY) and the Secret Key in Pages variable TURNSTILE_SECRET. Until both are set, the form works without it.

=== Where things live (written 2026-10-12) ===
Source of truth: this repository (GitHub StaniD54/meshfreehernia, branch main).
  index.html          the whole page (text, styles, scripts, 6 gallery photos embedded)
  functions/api/kontakt.js   contact form: Turnstile check + e-mail via Resend
  osielsko.mp4, osielsko-poster.jpg, og-image.jpg, robots.txt, sitemap.xml
To change text: edit index.html, commit to main; Cloudflare Pages deploys in 1-2 min.

Settings kept OUTSIDE the repo (re-create them if the Pages project is ever rebuilt):
  Cloudflare Pages > meshfreehernia > Settings > Variables and Secrets:
    RESEND_API_KEY (secret), MAIL_TO, MAIL_FROM (formularz@przepuklinabezsiatki.pl),
    TURNSTILE_SECRET (secret). After changing a variable: Deployments > Retry deployment.
  Turnstile widget "meshfreehernia.org" (Site Key is in index.html, TS_KEY).
  Cloudflare for meshfreehernia.org: rate-limit rule "Limit formularza" (/api/kontakt),
    redirects www -> root and meshfreehernia.co.uk -> https://meshfreehernia.org,
    Bot Fight Mode. Resend domain przepuklinabezsiatki.pl is verified.
  Google Search Console property meshfreehernia.org, sitemap.xml submitted.
Never put secret keys in this repository.
