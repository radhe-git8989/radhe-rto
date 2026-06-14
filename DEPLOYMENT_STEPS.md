# Deployment Guide for Radhe Insurance

Aa application ne live karva mate niche na steps follow karo:

## Step 1: GitHub par Code Upload karo
1.  [github.com](https://github.com) par jaine navu repository banavo (naam: `radhe_insurance`).
2.  Tamara terminal ma aa commands chalaavo:
    ```bash
    cd /home/ravi/radhe_insurance
    git init
    git add .
    git commit -m "Prepare for deployment"
    git branch -M main
    git remote add origin https://github.com/TAMARU_USERNAME/radhe_insurance.git
    git push -u origin main
    ```

## Step 2: Supabase (Database) Setup
1.  [supabase.com](https://supabase.com) par account banavo.
2.  Navu Project banavo.
3.  **Project Settings > Database** ma jaine **Connection String** copy karo (URI format ma).
    *   Te kaiak aavu dekhase: `postgresql://postgres:[PASSWORD]@db.xxxx.supabase.co:5432/postgres`

## Step 3: Render (Backend) Deployment
1.  [render.com](https://render.com) par jaine **New > Web Service** select karo.
2.  Tamaru GitHub repository connect karo.
3.  **Root Directory:** `backend`
4.  **Runtime:** `Python 3`
5.  **Build Command:** `pip install -r requirements.txt`
6.  **Start Command:** `gunicorn app:app`
7.  **Environment Variables** ma add karo:
    *   `DATABASE_URL`: (Tame Step 2 ma copy kareli string)

## Step 4: Vercel (Frontend) Deployment
1.  [vercel.com](https://vercel.com) par jaine navu project banavo.
2.  Tamaru GitHub repository connect karo.
3.  **Root Directory:** `frontend`
4.  **Framework Preset:** `Vite`
5.  **Environment Variables** ma add karo:
    *   `VITE_API_URL`: (Render ma backend deploy thaya pachi je URL male te, jem ke `https://backend-xxx.onrender.com`)

---
Jo tame Step 1 ane 2 kari lo, to mane janavo, hu aagad help kari shakish.
