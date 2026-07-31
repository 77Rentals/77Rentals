import { ReactNode } from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  heading: ReactNode;
  supporting?: ReactNode;
  variant: 'center' | 'left' | 'split';
  className?: string;
  eyebrowClassName?: string;
  headingClassName?: string;
  ruleClassName?: string;
  supportingClassName?: string;
}

const SectionHeading = ({
  eyebrow,
  heading,
  supporting,
  variant,
  className = '',
  eyebrowClassName = 'text-secondary',
  headingClassName = 'text-foreground',
  ruleClassName = 'bg-secondary',
  supportingClassName = 'text-muted-foreground leading-relaxed',
}: SectionHeadingProps) => {
  if (variant === 'center') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        {eyebrow && (
          <div className="flex items-center gap-3 mb-4">
            <div className={`h-px w-8 ${ruleClassName}`} />
            <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${eyebrowClassName}`}>
              {eyebrow}
            </span>
            <div className={`h-px w-8 ${ruleClassName}`} />
          </div>
        )}
        <h2 className={`font-serif heading-fluid-2 ${headingClassName}`}>{heading}</h2>
        <div className={`w-16 h-1 mt-6 rounded-full ${ruleClassName}`} />
      </div>
    );
  }

  if (variant === 'split') {
    return (
      <div className={`grid md:grid-cols-2 gap-8 items-start ${className}`}>
        <div>
          {eyebrow && (
            <div className="flex items-center gap-2 mb-3">
              <div className={`h-px w-8 ${ruleClassName}`} />
              <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${eyebrowClassName}`}>
                {eyebrow}
              </span>
            </div>
          )}
          <h2 className={`font-serif heading-fluid-2 ${headingClassName}`}>{heading}</h2>
        </div>
        {supporting && <p className={supportingClassName}>{supporting}</p>}
      </div>
    );
  }

  // variant === 'left'
  return (
    <div className={className}>
      {eyebrow && (
        <div className="flex items-center gap-2 mb-3">
          <div className={`h-px w-8 ${ruleClassName}`} />
          <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${eyebrowClassName}`}>
            {eyebrow}
          </span>
        </div>
      )}
      <h2 className={`font-serif heading-fluid-2 ${headingClassName}`}>{heading}</h2>
      {supporting && <p className={`mt-2 ${supportingClassName}`}>{supporting}</p>}
    </div>
  );
};

export default SectionHeading;
