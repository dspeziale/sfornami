# 🚀 GUIDA ALLA PUBBLICAZIONE ONLINE – SFORNAMÌ
## Come mettere online l'e-commerce con Vercel e Supabase

Questa guida illustra la procedura passo-passo per pubblicare **SFORNAMÌ** su un dominio internet personalizzato (es. `sfornami.it` o `sfornami-roma.it`).

---

## 1. Configurazione del Database (Supabase)

Il progetto utilizza **PostgreSQL** ospitato su **Supabase** (piano gratuito o Pro):

1. Vai su [https://supabase.com](https://supabase.com) e accedi (o crea un account gratuito).
2. Clicca su **"New Project"**.
   - **Name:** `sfornami-roma`
   - **Database Password:** scegli una password sicura e annotala.
   - **Region:** seleziona `Central EU (Frankfurt)` o la più vicina a Roma per massima velocità.
3. Clicca su **"Create new project"** e attendi 1-2 minuti.
4. Nel menu a sinistra vai su **"SQL Editor"**.
5. Clicca su **"New query"**:
   - Apri il file `supabase/schema.sql` presente in questo repository, copia tutto il codice e incollalo nell'editor.
   - Clicca su **"Run"** per creare tutte le tabelle relazionali e le regole di sicurezza (RLS).
6. Crea un'altra query:
   - Apri il file `supabase/seed.sql`, copia il codice e clicca su **"Run"** per inserire le categorie e i primi prodotti di panetteria e pasticceria.
7. Nel menu a sinistra vai su **Project Settings** (icona ingranaggio) -> **API**:
   - Copia il **Project URL** (es. `https://xyzcompany.supabase.co`).
   - Copia la **Project API Key (anon/public)**.

---

## 2. Pubblicazione su Vercel (Consigliato)

Vercel è la piattaforma cloud ufficiale ottimizzata per Next.js:

1. Carica il codice di questo progetto su GitHub (repository privato o pubblico):
   ```bash
   git add .
   git commit -m "feat: SFORNAMÌ complete e-commerce platform"
   git branch -M main
   git remote add origin https://github.com/<tuo-utente>/sfornami.git
   git push -u origin main
   ```
2. Vai su [https://vercel.com](https://vercel.com) e accedi con il tuo account GitHub.
3. Clicca su **"Add New..."** -> **"Project"**.
4. Seleziona il repository `sfornami` e clicca su **"Import"**.
5. Nella sezione **Environment Variables**, aggiungi le seguenti variabili:
   - `NEXT_PUBLIC_SUPABASE_URL` = *(il tuo Project URL di Supabase)*
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = *(la tua anon key di Supabase)*
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` = `393401234567` *(il numero del laboratorio)*
6. Clicca su **"Deploy"**.
7. In circa 60 secondi il sito sarà online e accessibile in tutto il mondo con certificato SSL HTTPS gratuito!

---

## 3. Collegamento del Dominio Personalizzato (es. sfornami.it)

1. Su Vercel, vai nella scheda **Settings** del progetto -> **Domains**.
2. Digita il tuo dominio (es. `sfornami.it` o `www.sfornami.it`) e clicca su **Add**.
3. Vercel ti mostrerà i record DNS da inserire nel pannello del tuo registrar (Aruba, Register.it, Namecheap, Google Domains):
   - Record **A** verso l'IP di Vercel: `76.76.21.21`
   - Record **CNAME** per `www` verso `cname.vercel-dns.com`
4. Una volta propagati i DNS (da 15 minuti a poche ore), il sito sarà raggiungibile sul tuo dominio ufficiale con lucchetto di sicurezza HTTPS attivo.

---

## 4. Attivazione WhatsApp Business Cloud API (Opzionale)

Il sito integra già la modalità **Click-to-Chat WhatsApp**, che non richiede costi o approvazioni da Meta.

Se in futuro si desidera inviare notifiche WhatsApp automatiche silenziose:
1. Registra un account su [Meta for Developers](https://developers.facebook.com).
2. Crea un'app di tipo **Business** e aggiungi il prodotto **WhatsApp**.
3. Verifica il numero di telefono del laboratorio.
4. Inserisci le chiavi API nel webhook del backend per l'invio delle notifiche push.
