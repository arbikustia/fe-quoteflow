import type { ReactElement } from "react";
import { FiDownload, FiPlus } from "react-icons/fi";

import { ButtonComponent } from "@/components/Button";

/**
 * Render component preview page.
 * @returns {ReactElement} Button preview canvas.
 */
const Preview = (): ReactElement => {
  return (
    <main className="min-h-full overflow-auto bg-background-page p-4 text-text-primary sm:p-6 lg:p-8">
      <section className="mx-auto max-w-5xl rounded-large border border-border-default bg-background-surface p-5 shadow-small sm:p-6">
        <header className="mb-6 border-b border-border-default pb-5">
          <h1 className="text-2xl font-semibold leading-8">Button preview</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Review reusable actions across variants, sizes, and states.
          </p>
        </header>

        <div className="space-y-8">
          <section>
            <h2 className="mb-4 text-lg font-semibold leading-7">Purpose examples</h2>
            <div className="flex flex-wrap items-center gap-3">
              <ButtonComponent leftIcon={<FiPlus />} variant="primary">
                Create quotation
              </ButtonComponent>
              <ButtonComponent leftIcon={<FiDownload />} variant="secondary">
                Download PDF
              </ButtonComponent>
              <ButtonComponent variant="danger">Delete quotation</ButtonComponent>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold leading-7">Variants</h2>
            <div className="flex flex-wrap items-center gap-3">
              <ButtonComponent variant="primary">Primary</ButtonComponent>
              <ButtonComponent variant="secondary">Secondary</ButtonComponent>
              <ButtonComponent variant="tertiary">Tertiary</ButtonComponent>
              <ButtonComponent variant="danger">Danger</ButtonComponent>
              <ButtonComponent variant="ghost">Ghost</ButtonComponent>
              <ButtonComponent variant="link">Link</ButtonComponent>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold leading-7">Sizes and states</h2>
            <div className="flex flex-wrap items-center gap-3">
              <ButtonComponent size="small">Small</ButtonComponent>
              <ButtonComponent>Default</ButtonComponent>
              <ButtonComponent size="large">Large</ButtonComponent>
              <ButtonComponent disabled={true}>Disabled</ButtonComponent>
              <ButtonComponent isLoading={true}>Creating quotation</ButtonComponent>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default Preview;
