import type { ReactElement } from "react";
import { useState } from "react";
import { FiDownload, FiPlus } from "react-icons/fi";

import { ButtonComponent } from "@/components/Button";
import { DatePicker } from "@/components/DatePicker";
import { DateRangePicker } from "@/components/DateRangePicker";

/**
 * Render component preview page.
 * @returns {ReactElement} Button preview canvas.
 */
const Preview = (): ReactElement => {
  const [date, setDate] = useState("2026-10-14");
  const [startDate, setStartDate] = useState("2026-10-01");
  const [endDate, setEndDate] = useState("2026-10-31");

  /**
   * Update single date preview.
   * @param {ChangeEvent<HTMLInputElement>} event - input change event
   * @returns {void}
   */
  const handleDateChange = (value: string): void => setDate(value);

  /**
   * Update range start date preview.
   * @param {ChangeEvent<HTMLInputElement>} event - input change event
   * @returns {void}
   */
  const handleStartDateChange = (value: string): void => setStartDate(value);

  /**
   * Update range end date preview.
   * @param {ChangeEvent<HTMLInputElement>} event - input change event
   * @returns {void}
   */
  const handleEndDateChange = (value: string): void => setEndDate(value);

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

          <section className="border-t border-border-default pt-8">
            <h2 className="text-lg font-semibold leading-7">Date controls</h2>
            <p className="mt-1 text-sm text-text-secondary">Reusable date picker and date range picker.</p>
            <div className="mt-5 grid gap-6 lg:grid-cols-2">
              <DatePicker
                label="Quotation date"
                value={date}
                onChange={handleDateChange}
              />
              <DateRangePicker
                label="Rental period"
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={handleStartDateChange}
                onEndDateChange={handleEndDateChange}
              />
            </div>
            <div className="mt-6">
              <DateRangePicker
                label="Compact report period"
                variant="compact"
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={handleStartDateChange}
                onEndDateChange={handleEndDateChange}
              />
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default Preview;
