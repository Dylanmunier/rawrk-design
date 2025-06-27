-- Schéma SQL complet pour application e-commerce Next.js/Supabase

-- =========================
-- TABLE UTILISATEURS (clients & admins)
-- =========================
create table public.users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique not null, -- id de supabase.auth.users
  email text unique not null,
  nom text,
  prenom text,
  telephone text,
  adresse text,
  ville text,
  code_postal text,
  pays text,
  role text not null default 'client', -- 'client' ou 'admin'
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- =========================
-- TABLE PRODUITS (models)
-- =========================
create table public.models (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  description text,
  prix numeric(10,2) not null,
  image_url text,
  stock integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- =========================
-- TABLE COMMANDES
-- =========================
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  email text not null,
  total numeric(10,2) not null,
  statut text default 'en attente',
  adresse_livraison text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- =========================
-- TABLE LIGNES DE COMMANDE (détail des produits commandés)
-- =========================
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  model_id uuid references public.models(id) on delete set null,
  quantite integer not null,
  prix_unitaire numeric(10,2) not null
);

-- =========================
-- TABLE MESSAGES (support/contact)
-- =========================
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  email text not null,
  sujet text,
  contenu text,
  statut text default 'ouvert',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- =========================
-- TABLE HISTORIQUE DE CONNEXION (optionnel)
-- =========================
create table public.login_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  ip_address text,
  user_agent text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- =========================
-- TABLE CATÉGORIES DE PRODUITS
-- =========================
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Lien produit <-> catégorie (plusieurs catégories par produit possible)
create table public.model_categories (
  model_id uuid references public.models(id) on delete cascade,
  category_id uuid references public.categories(id) on delete cascade,
  primary key (model_id, category_id)
);

-- =========================
-- TABLE AVIS PRODUITS (ratings/reviews)
-- =========================
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  model_id uuid references public.models(id) on delete cascade,
  user_id uuid references public.users(id) on delete set null,
  note integer not null check (note >= 1 and note <= 5),
  commentaire text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- =========================
-- TABLE PANIER PERSISTANT (pour sauvegarder le panier d'un utilisateur connecté)
-- =========================
create table public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid references public.carts(id) on delete cascade,
  model_id uuid references public.models(id) on delete set null,
  quantite integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- =========================
-- TABLE NOTIFICATIONS (pour informer les utilisateurs/admins)
-- =========================
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  titre text not null,
  message text not null,
  lu boolean default false,
  type text, -- exemple : 'commande', 'admin', 'promo', etc.
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- =========================
-- TABLE LOGS D'ACTIVITÉ (audit trail)
-- =========================
create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  action text not null,
  details jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- =========================
-- TABLE ADRESSES SUPPLÉMENTAIRES (pour clients avec plusieurs adresses)
-- =========================
create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  label text, -- exemple : 'Domicile', 'Travail', etc.
  adresse text,
  ville text,
  code_postal text,
  pays text,
  telephone text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- =========================
-- TABLES POUR LE GARAGE CLIENT ET LES VÉHICULES
-- =========================
create table public.vehicles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  modele_id uuid references public.models(id) on delete set null,
  nom text, -- nom personnalisé du véhicule
  annee integer,
  immatriculation text,
  statut text default 'en attente', -- 'en attente', 'payé', 'en salon', etc.
  droits jsonb, -- droits spéciaux utilisateur (ex: "prestige", "usager", etc.)
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- =========================
-- TABLES POUR LES SERVICES ASSOCIÉS AUX VÉHICULES
-- =========================
create table public.vehicle_services (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references public.vehicles(id) on delete cascade,
  type text not null, -- 'après-vente', 'automobile', 'usager', 'prestige', 'révision', 'événementiel', 'certificat', 'urgence', 'assurance', etc.
  description text,
  statut text default 'en attente',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- =========================
-- TABLES POUR LES PAIEMENTS STRIPE ET STATUTS
-- =========================
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  amount numeric(10,2) not null,
  currency text default 'eur',
  stripe_payment_intent_id text,
  statut text default 'en attente', -- 'en attente', 'payé', 'annulé'
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- =========================
-- TABLES POUR LES ACHATS EN ATTENTE
-- =========================
create table public.pending_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  statut text default 'en attente', -- 'en attente', 'payé', 'annulé'
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- =========================
-- TABLE ROLES PERSONNALISÉS
-- =========================
create table public.roles (
  id serial primary key,
  name text unique not null, -- ex: 'admin', 'manager', 'logistique', 'client', 'preparateur', etc.
  description text
);

-- =========================
-- TABLE PERMISSIONS (droits avancés)
-- =========================
create table public.permissions (
  id serial primary key,
  role_id integer references public.roles(id) on delete cascade,
  permission text not null, -- ex: 'voir_commandes', 'modifier_vehicule', 'exporter', etc.
  granted boolean default true
);

-- =========================
-- TABLE FOURNISSEURS / CONCESSIONNAIRES
-- =========================
create table public.suppliers (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  pays text,
  ville text,
  adresse text,
  telephone text,
  email text,
  type text, -- 'concessionnaire', 'partenaire', 'logistique', etc.
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- =========================
-- TABLE COMMANDES DE VÉHICULES (achat chez fournisseur)
-- =========================
create table public.vehicle_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  supplier_id uuid references public.suppliers(id) on delete set null,
  prix_achat numeric(10,2),
  devise text default 'eur',
  statut text default 'en attente', -- 'en attente', 'commandé', 'reçu', 'en préparation', 'livré', 'exporté', etc.
  date_commande timestamp with time zone,
  date_reception timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- =========================
-- TABLE IMPORTATIONS DE VÉHICULES
-- =========================
create table public.vehicle_imports (
  id uuid primary key default gen_random_uuid(),
  vehicle_order_id uuid references public.vehicle_orders(id) on delete cascade,
  pays_origine text,
  pays_destination text,
  date_depart timestamp with time zone,
  date_arrivee timestamp with time zone,
  statut text default 'en transit',
  transporteur text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- =========================
-- TABLE PRÉPARATION / CUSTOMISATION DE VÉHICULES
-- =========================
create table public.vehicle_preparations (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references public.vehicles(id) on delete cascade,
  description text,
  statut text default 'en attente', -- 'en attente', 'en cours', 'terminé'
  responsable uuid references public.users(id) on delete set null,
  date_debut timestamp with time zone,
  date_fin timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- =========================
-- TABLE LIVRAISON DE VÉHICULES
-- =========================
create table public.vehicle_deliveries (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references public.vehicles(id) on delete cascade,
  adresse_livraison text,
  pays text,
  ville text,
  date_livraison timestamp with time zone,
  statut text default 'en attente', -- 'en attente', 'en cours', 'livré'
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- =========================
-- TABLE EXPORTATION DE VÉHICULES (France/Martinique)
-- =========================
create table public.vehicle_exports (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references public.vehicles(id) on delete cascade,
  pays_destination text,
  date_export timestamp with time zone,
  statut text default 'en attente',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- =========================
-- TABLE REPORTING / EXPORTS DE DONNÉES
-- =========================
create table public.reporting_exports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  type text, -- 'commandes', 'ventes', 'livraisons', etc.
  format text, -- 'csv', 'pdf', etc.
  url_export text,
  date_export timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- =========================
-- TABLE HISTORIQUE D'ÉTAT DES VÉHICULES (avancement)
-- =========================
create table public.vehicle_status_history (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references public.vehicles(id) on delete cascade,
  statut text not null, -- 'commandé', 'en transit', 'en préparation', 'livré', etc.
  commentaire text,
  date_statut timestamp with time zone default timezone('utc'::text, now())
);

-- =========================
-- INDEXES POUR LES REQUÊTES RAPIDES
-- =========================
create index idx_orders_user_id on public.orders(user_id);
create index idx_order_items_order_id on public.order_items(order_id);
create index idx_order_items_model_id on public.order_items(model_id);

-- =========================
-- EXEMPLE D'INSERTION D'UN ADMIN
-- =========================
-- insert into public.users (auth_user_id, email, nom, prenom, role) values ('<id_supabase>', 'admin@email.com', 'Admin', 'Super', 'admin'); 

-- Si besoin, voici les ALTER TABLE pour garantir la présence des champs :

alter table public.notifications add column if not exists lu boolean default false;
alter table public.notifications add column if not exists titre text;
alter table public.notifications add column if not exists message text;
alter table public.notifications add column if not exists type text;

alter table public.activity_logs add column if not exists action text;
alter table public.activity_logs add column if not exists details jsonb;

alter table public.addresses add column if not exists label text;
alter table public.addresses add column if not exists adresse text;
alter table public.addresses add column if not exists ville text;
alter table public.addresses add column if not exists code_postal text;
alter table public.addresses add column if not exists pays text;
alter table public.addresses add column if not exists telephone text;

alter table public.reviews add column if not exists note integer;
alter table public.reviews add column if not exists commentaire text;

alter table public.users add column if not exists role text default 'client';

alter table public.vehicles add column if not exists droits jsonb;
alter table public.vehicles add column if not exists statut text default 'en attente';

alter table public.vehicle_services add column if not exists statut text default 'en attente'; 