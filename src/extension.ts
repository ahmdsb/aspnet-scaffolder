import * as vscode from "vscode";
import * as path from "path";

async function selectProject(): Promise<string | undefined> {
    const files = await vscode.workspace.findFiles("**/*.csproj", "**/bin/**", 50);

    if (files.length === 0) {
        vscode.window.showErrorMessage("No .csproj file found in the workspace.");
        return undefined;
    }

    if (files.length === 1) {
        return files[0].fsPath;
    }

    const items = files.map(f => ({
        label: path.basename(f.fsPath),
        description: f.fsPath
    }));

    const pick = await vscode.window.showQuickPick(items, {
        title: "Select project (.csproj)",
        canPickMany: false
    });

    return pick?.description;
}

function runCommand(cmd: string, cwd?: string) {
    const terminalName = "ASP.NET & EF";
    let term = vscode.window.terminals.find(t => t.name === terminalName);
    if (!term) {
        term = vscode.window.createTerminal({ name: terminalName });
    }

    term.show();
    if (cwd) {
        term.sendText(`cd "${cwd}"`);
    }
    term.sendText(cmd);
}

async function scaffoldIdentitySelect() {
    const project = await selectProject();
    if (!project) return;

    const dbContext = await vscode.window.showInputBox({
        title: "DbContext name",
        prompt: "Example: ApplicationDbContext",
        value: "ApplicationDbContext"
    });
    if (!dbContext) return;

    const identityFiles = [
        "Login",
        "Register",
        "Logout",
        "ForgotPassword",
        "ResetPassword",
        "Manage/Index",
        "Manage/Email",
        "Manage/TwoFactorAuthentication"
    ];

    const picks = await vscode.window.showQuickPick(identityFiles, {
        title: "Select Identity files to scaffold",
        canPickMany: true
    });
    if (!picks || picks.length === 0) {
        vscode.window.showWarningMessage("No Identity files selected.");
        return;
    }

    const filesArg = picks.join(";");

    const cmd = `dotnet aspnet-codegenerator identity ` +
        `-dc ${dbContext} ` +
        `--files "${filesArg}" ` +
        `--project "${project}"`;

    runCommand(cmd, path.dirname(project));
}

async function scaffoldIdentityFull() {
    const project = await selectProject();
    if (!project) return;

    const dbContext = await vscode.window.showInputBox({
        title: "DbContext name",
        value: "ApplicationDbContext"
    });
    if (!dbContext) return;

    const cmd = `dotnet aspnet-codegenerator identity ` +
        `-dc ${dbContext} ` +
        `--useDefaultUI ` +
        `--project "${project}"`;

    runCommand(cmd, path.dirname(project));
}

async function scaffoldControllerCrud() {
    const project = await selectProject();
    if (!project) return;

    const controllerName = await vscode.window.showInputBox({
        title: "Controller name",
        prompt: "Example: JobPostingController",
        value: "JobPostingController"
    });
    if (!controllerName) return;

    const modelName = await vscode.window.showInputBox({
        title: "Model name",
        prompt: "Example: JobPosting",
        value: "JobPosting"
    });
    if (!modelName) return;

    const dbContext = await vscode.window.showInputBox({
        title: "DbContext name",
        value: "ApplicationDbContext"
    });
    if (!dbContext) return;

    const cmd = `dotnet aspnet-codegenerator controller ` +
        `-name ${controllerName} ` +
        `-m ${modelName} ` +
        `-dc ${dbContext} ` +
        `--relativeFolderPath Controllers ` +
        `--useDefaultLayout --force ` +
        `--project "${project}"`;

    runCommand(cmd, path.dirname(project));
}

async function scaffoldRazorCrud() {
    const project = await selectProject();
    if (!project) return;

    const modelName = await vscode.window.showInputBox({
        title: "Model name",
        value: "JobPosting"
    });
    if (!modelName) return;

    const dbContext = await vscode.window.showInputBox({
        title: "DbContext name",
        value: "ApplicationDbContext"
    });
    if (!dbContext) return;

    const folder = await vscode.window.showInputBox({
        title: "Output folder (under Pages/...)",
        value: "JobPostings"
    });
    if (!folder) return;

    const cmd = `dotnet aspnet-codegenerator razorpage ` +
        `-m ${modelName} ` +
        `-dc ${dbContext} ` +
        `-outDir Pages/${folder} ` +
        `--useDefaultLayout --force ` +
        `--project "${project}"`;

    runCommand(cmd, path.dirname(project));
}

async function scaffoldEmptyView() {
    const project = await selectProject();
    if (!project) return;

    const viewName = await vscode.window.showInputBox({
        title: "View name",
        value: "MyView"
    });
    if (!viewName) return;

    const controller = await vscode.window.showInputBox({
        title: "Controller name (folder under Views)",
        value: "Home"
    });
    if (!controller) return;

    const cmd = `dotnet aspnet-codegenerator view ` +
        `${viewName} Empty ` +
        `--relativeFolderPath Views/${controller} ` +
        `--project "${project}"`;

    runCommand(cmd, path.dirname(project));
}

async function scaffoldEmptyController() {
    const project = await selectProject();
    if (!project) return;

    const controller = await vscode.window.showInputBox({
        title: "Controller name",
        value: "SampleController"
    });
    if (!controller) return;

    const cmd = `dotnet aspnet-codegenerator controller ` +
        `-name ${controller} ` +
        `--relativeFolderPath Controllers ` +
        `--force ` +
        `--project "${project}"`;

    runCommand(cmd, path.dirname(project));
}

async function efAddMigration() {
    const project = await selectProject();
    if (!project) return;

    const migrationName = await vscode.window.showInputBox({
        title: "Migration name",
        prompt: "Example: InitialCreate",
        value: "InitialCreate"
    });
    if (!migrationName) return;

    const dbContext = await vscode.window.showInputBox({
        title: "DbContext name (optional)",
        prompt: "Leave empty if you only have one DbContext",
        value: ""
    });

    let cmd = `dotnet ef migrations add ${migrationName} ` +
        `--project "${project}"`;

    if (dbContext && dbContext.trim().length > 0) {
        cmd += ` --context ${dbContext.trim()}`;
    }

    runCommand(cmd, path.dirname(project));
}

async function efUpdateDatabase() {
    const project = await selectProject();
    if (!project) return;

    const target = await vscode.window.showInputBox({
        title: "Target migration (optional)",
        prompt: "Leave empty to update to latest, or specify migration name",
        value: ""
    });

    let cmd = `dotnet ef database update ` +
        `--project "${project}"`;

    if (target && target.trim().length > 0) {
        cmd += ` ${target.trim()}`;
    }

    runCommand(cmd, path.dirname(project));
}

async function efListMigrations() {
    const project = await selectProject();
    if (!project) return;

    const dbContext = await vscode.window.showInputBox({
        title: "DbContext name (optional)",
        prompt: "Leave empty to use default",
        value: ""
    });

    let cmd = `dotnet ef migrations list ` +
        `--project "${project}"`;

    if (dbContext && dbContext.trim().length > 0) {
        cmd += ` --context ${dbContext.trim()}`;
    }

    runCommand(cmd, path.dirname(project));
}

async function efDbContextInfo() {
    const project = await selectProject();
    if (!project) return;

    const dbContext = await vscode.window.showInputBox({
        title: "DbContext name (optional)",
        prompt: "Leave empty to use default",
        value: ""
    });

    let cmd = `dotnet ef dbcontext info ` +
        `--project "${project}"`;

    if (dbContext && dbContext.trim().length > 0) {
        cmd += ` --context ${dbContext.trim()}`;
    }

    runCommand(cmd, path.dirname(project));
}

export function activate(ctx: vscode.ExtensionContext) {
    ctx.subscriptions.push(
        vscode.commands.registerCommand("aspnet.scaffold.controllerCrud", scaffoldControllerCrud),
        vscode.commands.registerCommand("aspnet.scaffold.razorCrud", scaffoldRazorCrud),
        vscode.commands.registerCommand("aspnet.scaffold.identity", scaffoldIdentityFull),
        vscode.commands.registerCommand("aspnet.scaffold.identitySelect", scaffoldIdentitySelect),
        vscode.commands.registerCommand("aspnet.scaffold.emptyView", scaffoldEmptyView),
        vscode.commands.registerCommand("aspnet.scaffold.emptyController", scaffoldEmptyController),
        vscode.commands.registerCommand("aspnet.ef.addMigration", efAddMigration),
        vscode.commands.registerCommand("aspnet.ef.updateDatabase", efUpdateDatabase),
        vscode.commands.registerCommand("aspnet.ef.listMigrations", efListMigrations),
        vscode.commands.registerCommand("aspnet.ef.dbContextInfo", efDbContextInfo)
    );

    vscode.window.showInformationMessage("ASP.NET Scaffolder + EF Core commands loaded.");
}

export function deactivate() {}
