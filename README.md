# ASP.NET Scaffolder

ASP.NET Scaffolder is a VS Code extension that provides **GUI-style scaffolding** for ASP.NET Core projects.

It wraps the `dotnet aspnet-codegenerator` and `dotnet ef` CLIs into easy-to-use commands with prompts and quick-picks.

## ✨ Features

### ASP.NET Core scaffolding

- **MVC Controller + Views (CRUD)**
- **Razor Pages CRUD**
- **Identity UI**
  - Full Identity UI (all pages)
  - Selected Identity pages (Login, Register, etc.) via multi-select
- **Empty controller**
- **Empty view**

### EF Core helpers

- **Add Migration**
- **Update Database**
- **List Migrations**
- **DbContext Info**

Works with:

- Single-project workspaces (one `.csproj` at the root)
- Multi-project workspaces (you pick which `.csproj` to use)

---

## 🧩 Requirements

Make sure you have:

- [.NET SDK](https://dotnet.microsoft.com/) (6.0+ recommended, 8.0 works great)
- ASP.NET Core project(s) with `.csproj`

### Required global tools

These tools must be installed globally:

```bash
dotnet tool install -g dotnet-aspnet-codegenerator
dotnet tool install -g dotnet-ef
```

### Required NuGet packages (per project)

Inside your ASP.NET Core project folder (where your `.csproj` lives), install:

```bash
dotnet add package Microsoft.VisualStudio.Web.CodeGeneration.Design
dotnet add package Microsoft.EntityFrameworkCore.Design
```

### Quick sanity check

You can verify that the tools are available with:

```bash
dotnet --info
dotnet tool list -g
dotnet aspnet-codegenerator --help
dotnet-ef --help
```

If `dotnet-aspnet-codegenerator` or `dotnet-ef` do not appear or fail, install them using the commands above before using the extension.

---

## 🚀 Usage

After installing the extension:

1. Open your ASP.NET Core solution in VS Code.
2. Press **`Ctrl + Shift + P`** (or `Cmd + Shift + P` on macOS).
3. Type part of the command name, e.g. `ASP.NET: Scaffold` or `EF Core:`.
4. Follow the prompts (controller name, model name, DbContext, etc.).

### ASP.NET Commands

#### 1. Scaffold MVC Controller + Views (CRUD)

Command:

> **ASP.NET: Scaffold MVC Controller + Views (CRUD)**

Prompts:

- `Controller name` (e.g. `JobPostingController`)
- `Model name` (e.g. `JobPosting`)
- `DbContext name` (e.g. `ApplicationDbContext`)

Generates:

- `Controllers/YourControllerName.cs`
- `Views/YourControllerName/Index.cshtml`
- `Views/YourControllerName/Create.cshtml`
- `Views/YourControllerName/Edit.cshtml`
- `Views/YourControllerName/Delete.cshtml`
- `Views/YourControllerName/Details.cshtml`

---

#### 2. Scaffold Razor Pages CRUD

Command:

> **ASP.NET: Scaffold Razor Pages CRUD**

Prompts:

- `Model name` (e.g. `JobPosting`)
- `DbContext name`
- `Output folder` under `Pages/` (e.g. `JobPostings`)

Generates:

- `Pages/JobPostings/*.cshtml` and corresponding `.cshtml.cs` files.

---

#### 3. Scaffold Identity UI (Full)

Command:

> **ASP.NET: Scaffold Identity UI (Full)**

Prompts:

- `DbContext name` (e.g. `AppDbContext` or `ApplicationDbContext`)

Generates all Identity UI pages (Login, Register, Manage, etc.) under the standard `Areas/Identity` structure, depending on your generator version.

> **Note:** You must have Identity configured and `app.MapRazorPages();` (or equivalent) in your app startup for Identity pages to be reachable.

---

#### 4. Scaffold Identity UI (Select Files)

Command:

> **ASP.NET: Scaffold Identity UI (Select Files)**

Prompts:

- `DbContext name`
- Multi-select list of Identity files, e.g.:
  - `Login`
  - `Register`
  - `Logout`
  - `ForgotPassword`
  - `ResetPassword`
  - `Manage/Index`
  - `Manage/Email`
  - `Manage/TwoFactorAuthentication`

Generates only the selected Identity pages.

---

#### 5. Scaffold Empty View

Command:

> **ASP.NET: Scaffold Empty View**

Prompts:

- `View name` (e.g. `Dashboard`)
- `Controller name (folder under Views)` (e.g. `Home`)

Generates:

- `Views/Home/Dashboard.cshtml`

---

#### 6. Scaffold Empty Controller

Command:

> **ASP.NET: Scaffold Empty Controller**

Prompts:

- `Controller name` (e.g. `ReportsController`)

Generates:

- `Controllers/ReportsController.cs`

---

### EF Core Commands

All EF Core commands run `dotnet ef` behind the scenes in a dedicated terminal named **“ASP.NET & EF”**.

The extension will ask you to pick the `.csproj` if multiple projects are found.

#### 1. EF Core: Add Migration

Command:

> **EF Core: Add Migration**

Prompts:

- `Migration name` (e.g. `InitialCreate`)
- `DbContext name (optional)` — leave empty if you have only one DbContext

Runs something like:

```bash
dotnet ef migrations add InitialCreate \
  --project "YourProject.csproj" \
  --startup-project "YourProject.csproj" \
  --context YourDbContext   # only if provided
```

---

#### 2. EF Core: Update Database

Command:

> **EF Core: Update Database**

Prompts:

- `Target migration (optional)` — leave empty to update to latest

Runs:

```bash
dotnet ef database update \
  --project "YourProject.csproj" \
  --startup-project "YourProject.csproj" \
  TargetMigration   # only if provided
```

---

#### 3. EF Core: List Migrations

Command:

> **EF Core: List Migrations**

Prompts:

- `DbContext name (optional)`

Runs:

```bash
dotnet ef migrations list \
  --project "YourProject.csproj" \
  --startup-project "YourProject.csproj" \
  --context YourDbContext   # only if provided
```

---

#### 4. EF Core: DbContext Info

Command:

> **EF Core: DbContext Info**

Prompts:

- `DbContext name (optional)`

Runs:

```bash
dotnet ef dbcontext info \
  --project "YourProject.csproj" \
  --startup-project "YourProject.csproj" \
  --context YourDbContext   # only if provided
```

---

## 🛠 Development

If you want to work on the extension itself:

1. Clone or extract the project:

   ```bash
   git clone https://github.com/your-username/aspnet-scaffolder.git
   cd aspnet-scaffolder
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Compile TypeScript:

   ```bash
   npm run compile
   ```

4. Start the Extension Development Host:

   - Open this folder in VS Code.
   - Press **F5**.
   - A new VS Code window will open with the extension loaded in dev mode.
   - In that new window, open your ASP.NET Core project and try the commands (Command Palette → `ASP.NET:` or `EF Core:`).

5. Edit `src/extension.ts`, then re-run:

   ```bash
   npm run compile
   ```

   and restart the debug session if needed.

---

## 📦 Manual Installation (VSIX)

If you want to install the extension manually in your own VS Code (without publishing to the marketplace):

1. In the extension project folder, build a `.vsix` package:

   ```bash
   npm install
   npm run compile
   npm run package
   ```

   This will generate a file like:

   ```text
   aspnet-scaffolder-0.1.0-beta.1.vsix
   ```

2. Install the `.vsix` into VS Code:

   **Option A: from VS Code UI**

   - Open VS Code.
   - Go to the **Extensions** view.
   - Click the `⋯` (More Actions) button in the Extensions panel.
   - Choose **“Install from VSIX…”**.
   - Select your `aspnet-scaffolder-0.1.0-beta.1.vsix`.
   - Confirm & reload VS Code if prompted.

   **Option B: from terminal**

   ```bash
   code --install-extension aspnet-scaffolder-0.1.0-beta.1.vsix
   ```

3. After installation, open your ASP.NET Core project and use the commands via Command Palette.

---

## 🔍 Troubleshooting

- **“Build failed. Use dotnet build to see the errors.”**  
  All scaffolding and EF commands rely on a **successful build**.  
  Run:

  ```bash
  dotnet build
  ```

  Fix all compile errors, then run the command again.

- **No `.csproj` found**  
  Make sure you open the **folder that contains your project file(s)**, not just a subfolder.

- **Identity commands failing on options**  
  Different versions of `dotnet-aspnet-codegenerator` support slightly different options.  
  Run:

  ```bash
  dotnet aspnet-codegenerator identity --help
  ```

  and adjust your usage accordingly.

---

## 📄 License

This project is open source and free to use.

See the `LICENSE` file (MIT License).