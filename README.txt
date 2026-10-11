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
