export type EvalTask = {
  id: string;
  routes: string[];
  prompt: string;
};

const CONSTRAINTS = `
Constraints for this task:
- Use in-memory mock data defined in the feature module. There is no database or API.
- It must work at phone width (375px) and on desktop.
- Do not ask questions; make reasonable product choices and finish.
- When you are done, \`bun run build\` must succeed. Do not leave a dev server running.`;

const task = (id: string, routes: string[], request: string): EvalTask => ({
  id,
  routes,
  prompt: `${request.trim()}\n${CONSTRAINTS}`,
});

export const TASKS: EvalTask[] = [
  task(
    "list",
    ["/clients"],
    `Add a Clients page at /clients: a table of 25 clients (name, email, status, created date)
with a search box that filters by name or email, a status badge per row, an empty state when the
search matches nothing, and a "New client" button in the page header.`,
  ),
  task(
    "detail",
    ["/clients/acme"],
    `Add a client detail page at /clients/acme for the client "Acme Corp": its key facts (contact,
email, plan, created date, owner), a list of the 5 most recent activities, and Edit and Archive
actions in the page header. Archive asks for confirmation first.`,
  ),
  task(
    "form",
    ["/clients/new"],
    `Add a "New client" form page at /clients/new with name (required), email (required, valid
format), company size (a select), and notes (optional, multi-line). Show validation errors under
each field, and on submit show a success toast.`,
  ),
  task(
    "dialog",
    ["/team"],
    `Add a Team page at /team listing 8 members (avatar, name, email, role) and an "Invite member"
button that opens a dialog with an email field and a role select (Admin, Editor, Viewer). Sending
the invite closes the dialog and shows a toast.`,
  ),
  task(
    "overview",
    ["/"],
    `Replace the home page with an overview: 4 key numbers (active clients, open projects, revenue
this month, overdue invoices) and a list of the 6 most recent projects with their status.`,
  ),
  task(
    "settings",
    ["/settings"],
    `Add a Settings page at /settings with two sections: Profile (name, email, a Save button) and
Notifications (on/off toggles for email digests, mentions and product updates).`,
  ),
  task(
    "empty",
    ["/projects"],
    `Add a Projects page at /projects for a workspace that has no projects yet: a clear empty
state that explains what projects are for and offers a "Create project" action.`,
  ),
  task(
    "missing-component",
    ["/onboarding"],
    `Add an onboarding page at /onboarding with a 3-step progress stepper (Account, Workspace,
Invite team) showing the current step, the step's content below it (a short form for each), and
Back / Next buttons.`,
  ),
];
