# 🥖 SFORNAMÌ – Laboratorio Artigianale di Panetteria e Pasticceria (Roma)
> **"Il buono fatto a mano, con un pizzico di felicità."**

Piattaforma e-commerce completa, moderna e reattiva per il laboratorio artigianale di panetteria e pasticceria **SFORNAMÌ** a Roma (Centro Storico - Via dei Banchi Vecchi).

---

## 🌟 Caratteristiche Principali

### 1. Brand Identity & Design System
- **Palette cromatica**:
  - Rosa fragola `#F28BA6`
  - Giallo burro `#FFE29A`
  - Arancione pesca `#F5A16C`
  - Verde menta `#A8D8BD`
  - Crema `#FFF8EF`
  - Marrone cacao `#57382E`
- **Logo Vettoriale SFORNAMÌ** in SVG scalabile:
  - Versione Principale con payoff
  - Versione Secondaria orizzontale
  - Icona Favicon (`icon.svg`)
  - Versione Monocromatica per timbri, buste e packaging
  - Versione Quadrata Social Profile

### 2. Homepage & Esperienza Utente
- Hero section con fotografia ad alta risoluzione del tavolo delle sfornate, claim principale *"LA FELICITÀ HA IL PROFUMO DELLE COSE BUONE!"* e dual CTA.
- 4 macro-categorie grafiche: *IL PANE*, *I DOLCI*, *LE TORTE*, *LE NOSTRE GOLOSITÀ*.
- Sezioni: *I più amati dai clienti* (bestseller), *Le bontà della settimana*, *La storia di SFORNAMÌ*, *La qualità degli ingredienti* (lievito madre vivo, grani 100% italiani, uova bio laziali, burro di centrifuga), *Recensioni verificate*, *Come ordinare in 3 passi*, *Instagram Feed*, *Footer completo*.

### 3. Catalogo E-Commerce Completo
- **Panetteria**: Pane di Lariano cotto su pietra, Pane integrale ai 5 semi antichi, Pizza bianca romana alla pala, Focaccia barese con pomodorini, Grissini stirati all'EVO.
- **Pasticceria**: Maritozzo romano classico con panna fresca montata, Crostata con visciole selvatiche, Ciambellone soffice all'arancia, Cornetti sfogliati al burro, Tozzetti romani alle mandorle, Cookies extra dark.
- **Torte su Ordinazione**: Millefoglie caramellata con fragoline di Nemi, Red Velvet, Sacher artigianale, Naked Cakes da cerimonia.
- **Specialità Stagionali**: Bignè di San Giuseppe (fritti o al forno), Crostata moderna al pistacchio di Bronte e lamponi.
- Ricerca istantanea per nome/ingredienti, filtro per allergeni (Reg. UE 1169/2011), ordinamento per prezzo o popolarità, selettore varianti e schede prodotto dettagliate con tabella nutrizionale/ingredienti.

### 4. Carrello & Checkout
- Slide-over drawer laterale e pagina carrello dedicata con gestione quantità e note.
- Sistema codici promozionali (es. `BENVENUTO10`, `ROMA15`).
- **Modalità di ricezione**:
  - *Ritiro in laboratorio*: data e fasce orarie selezionabili per evitare code.
  - *Consegna a domicilio a Roma*: verifica CAP serviti (`00186`, `00187`, `00153`, `00192`...), calcolo tariffa (€3.50, gratis sopra €40), minimo d'ordine configurabile.
- Generazione codice ordine univoco (es. `SFN-2026-1042`), salvataggio a database e pagina di conferma con animazione confetti e stampa ricevuta comanda.

### 5. Doppia Integrazione WhatsApp Business
- **Modalità 1 (Ordine Diretto da WhatsApp)**: Genera link `wa.me` con carrello precompilato (prodotti, varianti, prezzi, totale, data, orario, indirizzo e note).
- **Modalità 2 (Ordine da Sito)**: Registrazione su database + notifica WhatsApp immediata con codice ordine.
- Pulsante galleggiante WhatsApp sempre presente per assistenza rapida.

### 6. Configuratore Torte Personalizzate
- Sezione interattiva per ordinare torte su misura: tipo torta, porzioni (6-30 persone), base pan di spagna, farcitura, decorazione, scritta personalizzata, data e orario.
- Registrate a pannello come richieste *in valutazione* per formulare il preventivo al cliente.

### 7. Pannello Amministrativo (Mobile-First)
- Accesso riservato protetto: `http://localhost:3000/admin` (Credenziali demo: `admin@sfornami.it` / `sfornami2026`).
- **Dashboard**: KPI ordini oggi, nuovi ordini, in preparazione, pronti, torte da valutare, fatturato.
- **Gestione Ordini**: visualizzazione tabella, cambio stato rapido (*Nuovo*, *In preparazione*, *Pronto*, *Consegnato*), stampa comanda forno, contatto cliente via WhatsApp con 1 tap.
- **Gestione Prodotti**: aggiungi nuovo prodotto, modifica prezzi, elimina, toggle disponibilità istantaneo.
- **Calendario & Fasce Orarie**: orari apertura, limite massimo ordini per fascia per non sovraccaricare il laboratorio.
- **Impostazioni**: recapiti, numero WhatsApp, costi consegna, CAP serviti, toggle Stripe.

### 8. Privacy, Normativa & SEO Locale
- Banner Cookie conforme GDPR con scelta preferenze.
- Pagine legali complete: Privacy Policy, Cookie Policy, Termini di Vendita, Tabella Allergeni UE 1169/2011.
- Dati strutturati `Schema.org/Bakery` JSON-LD per posizionamento locale su Google Roma.

---

## 🛠️ Stack Tecnologico

- **Framework**: Next.js 16 (App Router)
- **Linguaggio**: TypeScript
- **Styling**: Tailwind CSS v4 con design token personalizzati
- **Icone**: Lucide React + Vector SVG
- **Database**: Supabase / PostgreSQL con Row Level Security (RLS) + Fallback locale persistente
- **Animazioni**: Canvas Confetti, Micro-interazioni CSS

---

## 🚀 Avvio Rapido

### 1. Clonazione e Installazione
```bash
git clone <repository-url>
cd sfornami
npm install
```

### 2. Configurazione Ambiente (Opzionale)
Copia il file di esempio:
```bash
copy .env.example .env.local
```
*Nota: L'applicazione funziona al 100% fin da subito anche senza configurare chiavi esterne grazie al provider persistente integrato.*

### 3. Avvio in Sviluppo
```bash
npm run dev
```
Apri il browser su [http://localhost:3000](http://localhost:3000).

### 4. Build di Produzione
```bash
npm run build
npm run start
```
