import { Link } from 'react-router-dom';

interface AuthFormProps {
  title: string;
  description: string;
  children: React.ReactNode;
  cta: string;
  footerText: string;
  footerLink: string;
  footerLinkText: string;
}

export default function AuthForm({ title, description, children, cta, footerText, footerLink, footerLinkText }: AuthFormProps) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col rounded-[2rem] border border-slate-200/90 bg-white/95 p-8 shadow-soft backdrop-blur-xl sm:px-10 sm:py-10">
      <div className="space-y-3 text-center">
        <p className="text-3xl font-semibold text-slate-900">{title}</p>
        <p className="text-sm leading-6 text-slate-500">{description}</p>
      </div>
      <div className="mt-8 space-y-6">{children}</div>
      <button
        type="submit"
        className="mt-6 inline-flex w-full items-center justify-center rounded-3xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
      >
        {cta}
      </button>
      <p className="mt-6 text-center text-sm text-slate-500">
        {footerText}{' '}
        <Link to={footerLink} className="font-semibold text-sky-600 transition hover:text-sky-700">
          {footerLinkText}
        </Link>
      </p>
    </div>
  );
}
