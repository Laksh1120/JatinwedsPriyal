<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep this as a single-page TanStack Start invitation, with all content sections composed in `src/routes/index.tsx`; this preserves the original one-page scroll experience.
- Keep the session-only full-screen four-flap envelope → single background video → framed invitation experience self-contained in the index route and storage-guarded; this preserves SSR safety and the one-page architecture.
- Keep all site content inside the fixed ticket-shaped internal scroll container with the uploaded video's last frame behind it; this preserves the final invitation presentation.
