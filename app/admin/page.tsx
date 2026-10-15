'use client';

import React, { useState, useEffect } from 'react';
import { Formik, Form, FieldArray } from 'formik';
import { 
  Save, 
  RotateCcw, 
  Eye, 
  Palette, 
  Building2, 
  Rocket, 
  BarChart3, 
  Image as ImageIcon,
  MessageSquare,
  Star,
  Sparkles,
  Scale,
  DollarSign,
  ListOrdered,
  Target,
  HelpCircle,
  Layout,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2
} from 'lucide-react';
import { useDebounce } from 'use-debounce';
import { useSiteDataStore } from '@/lib/store';
import { 
  FormInput, 
  FormTextarea, 
  FormColorPicker, 
  FormImageUpload,
  FormImageSlider,
  FormArrayField,
  FormRow
} from '@/components/form';
import type { SiteData } from '@/lib/data';

export default function AdminPanel() {
  const {
    data,
    initialData,
    isLoading,
    isSaving,
    hasChanges,
    saveMessage,
    fetchData,
    saveChanges,
    discardChanges,
    setData
  } = useSiteDataStore();

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    theme: true,
    branding: false,
    hero: false,
    stats: false,
    transformations: false,
    testimonials: false,
    whyChoose: false,
    features: false,
    comparison: false,
    packages: false,
    howItWorks: false,
    inspirationBanner: false,
    faqs: false,
    footer: false,
  });

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Debounced data for live preview
  const [debouncedData] = useDebounce(data, 500);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-[#090b0a] flex items-center justify-center">
        <div className="text-white text-lg">Loading Admin Panel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090b0a] text-white">
      <Formik
        initialValues={data}
        enableReinitialize
        onSubmit={() => {}}
      >
        {({ values, setFieldValue }) => {
          // Sync Formik values with Zustand store
          useEffect(() => {
            setData(values);
          }, [values]);

          return (
            <Form className="h-screen flex flex-col">
              {/* Header */}
              <header className="border-b border-neutral-800 bg-[#0c0f0d] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-3">
                  <Layout className="w-6 h-6 text-[var(--primary)]" />
                  <div>
                    <h1 className="text-2xl font-black text-[var(--primary)] tracking-tight">
                      ADMIN PANEL
                    </h1>
                    <p className="text-sm text-neutral-400 mt-0.5">
                      Content Management System
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Save Message */}
                  {saveMessage && (
                    <span className={`text-sm font-semibold ${saveMessage.startsWith('✓') ? 'text-green-400' : 'text-red-400'}`}>
                      {saveMessage}
                    </span>
                  )}

                  {/* Changes Indicator */}
                  {hasChanges && (
                    <span className="text-sm text-yellow-400 font-semibold">
                      • Unsaved Changes
                    </span>
                  )}

                  {/* Discard Changes */}
                  <button
                    type="button"
                    onClick={discardChanges}
                    disabled={!hasChanges || isSaving}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold uppercase tracking-wider
                      bg-neutral-800 text-white border border-neutral-700
                      hover:border-neutral-500
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Discard
                  </button>

                  {/* Save Changes */}
                  <button
                    type="button"
                    onClick={saveChanges}
                    disabled={!hasChanges || isSaving}
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-black uppercase tracking-wider
                      bg-[var(--primary)] text-black
                      hover:bg-[var(--primary-hover)]
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all shadow-lg"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>

                  {/* Preview Site */}
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold uppercase tracking-wider
                      bg-neutral-800 text-white border border-neutral-700
                      hover:border-neutral-500
                      transition-all"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </a>
                </div>
              </header>

              {/* Split Screen Layout */}
              <div className="flex-1 flex overflow-hidden">
                {/* Left: Form Panel */}
                <div className="w-1/2 border-r border-neutral-800 overflow-y-auto">
                  <div className="p-6 space-y-4">
                    
                    {/* Theme Section */}
                    <Section
                      icon={<Palette className="w-5 h-5" />}
                      title="Theme & Styling"
                      isExpanded={expandedSections.theme}
                      onToggle={() => toggleSection('theme')}
                    >
                      <FormRow>
                        <FormColorPicker
                          name="theme.primaryColor"
                          label="Primary Color"
                          helpText="Main accent color"
                        />
                        <FormColorPicker
                          name="theme.primaryColorHover"
                          label="Primary Hover"
                          helpText="Hover state"
                        />
                      </FormRow>
                      <FormRow>
                        <FormColorPicker
                          name="theme.backgroundColor"
                          label="Background"
                        />
                        <FormColorPicker
                          name="theme.surfaceColor"
                          label="Surface/Cards"
                        />
                      </FormRow>
                      <FormRow>
                        <FormColorPicker
                          name="theme.borderColor"
                          label="Border Color"
                        />
                        <FormInput
                          name="theme.borderRadius"
                          label="Border Radius"
                          placeholder="0px"
                          helpText="e.g., 0px, 4px, 8px"
                        />
                      </FormRow>
                    </Section>

                    {/* Branding Section */}
                    <Section
                      icon={<Building2 className="w-5 h-5" />}
                      title="Branding & Identity"
                      isExpanded={expandedSections.branding}
                      onToggle={() => toggleSection('branding')}
                    >
                      <FormRow>
                        <FormInput name="branding.siteName" label="Site Name" />
                        <FormInput name="branding.tagline" label="Tagline" />
                      </FormRow>
                      <FormImageUpload name="branding.logo" label="Logo Image" />
                      <FormRow>
                        <FormInput name="branding.coachName" label="Coach Name" />
                        <FormInput name="branding.coachTitle" label="Coach Title" />
                      </FormRow>
                      <FormRow columns={1}>
                        <FormInput name="branding.coachExperienceYears" label="Experience Years" placeholder="14+" />
                      </FormRow>
                    </Section>

                    {/* Hero Section */}
                    <Section
                      icon={<Rocket className="w-5 h-5" />}
                      title="Hero Section"
                      isExpanded={expandedSections.hero}
                      onToggle={() => toggleSection('hero')}
                    >
                      <FormRow>
                        <FormInput name="hero.tagline" label="Tagline" />
                        <FormInput name="hero.ctaPrimary" label="Primary CTA" />
                      </FormRow>
                      <FormTextarea name="hero.headline" label="Main Headline" rows={2} />
                      <FormTextarea name="hero.subheadline" label="Subheadline" rows={2} />
                      <FormImageSlider 
                        name="hero.heroImages" 
                        label="Hero Images (Slider)" 
                        maxImages={5}
                        helpText="Add multiple images for hero slider. Supports RTL/LTR."
                      />
                      <FormArrayField name="hero.bullets" label="Bullet Points" placeholder="Benefit..." />
                      <FormRow columns={1}>
                        <FormInput name="hero.ctaSecondary" label="Secondary CTA" />
                      </FormRow>
                    </Section>

                    {/* Stats Section */}
                    <Section
                      icon={<BarChart3 className="w-5 h-5" />}
                      title="Stats Section"
                      isExpanded={expandedSections.stats}
                      onToggle={() => toggleSection('stats')}
                    >
                      <FormRow>
                        <FormInput name="stats.transformationsCount" label="Transformations Count" />
                        <FormInput name="stats.transformationsLabel" label="Transformations Label" />
                      </FormRow>
                      <FormRow>
                        <FormInput name="stats.weeksToChange" label="Weeks to Change" />
                        <FormInput name="stats.weeksLabel" label="Weeks Label" />
                      </FormRow>
                      <FormRow>
                        <FormInput name="stats.experienceYears" label="Experience Years" />
                        <FormInput name="stats.experienceLabel" label="Experience Label" />
                      </FormRow>
                    </Section>

                    {/* Transformations Section */}
                    <Section
                      icon={<ImageIcon className="w-5 h-5" />}
                      title="Transformations Gallery"
                      isExpanded={expandedSections.transformations}
                      onToggle={() => toggleSection('transformations')}
                    >
                      <FormRow>
                        <FormInput name="transformations.tag" label="Section Tag" />
                        <FormInput name="transformations.heading" label="Section Heading" />
                      </FormRow>
                      <FormTextarea name="transformations.subheading" label="Subheading" rows={2} />
                      <FormImageSlider 
                        name="transformations.galleryImages" 
                        label="Gallery Images (Slider)" 
                        maxImages={15}
                        helpText="Upload transformation images"
                      />
                    </Section>

                    {/* Testimonials Section */}
                    <Section
                      icon={<MessageSquare className="w-5 h-5" />}
                      title="Testimonials"
                      isExpanded={expandedSections.testimonials}
                      onToggle={() => toggleSection('testimonials')}
                    >
                      <FormRow>
                        <FormInput name="testimonials.tag" label="Section Tag" />
                        <FormInput name="testimonials.heading" label="Heading" />
                      </FormRow>
                      <FormTextarea name="testimonials.subheading" label="Subheading" rows={2} />
                      
                      <div className="space-y-4 mt-4">
                        <FieldArray name="testimonials.reviews">
                          {({ push, remove }) => (
                            <div className="space-y-4">
                              {values.testimonials.reviews.map((review, index) => (
                                <div key={review.id} className="p-4 bg-[#0c0f0d] border border-neutral-800 space-y-3">
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs font-mono text-[var(--primary)]">Review #{index + 1}</span>
                                    <button
                                      type="button"
                                      onClick={() => remove(index)}
                                      className="p-1.5 bg-red-900/20 border border-red-800 text-red-300 hover:bg-red-900/30"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                  <FormRow>
                                    <FormInput name={`testimonials.reviews.${index}.name`} label="Client Name" />
                                    <FormInput name={`testimonials.reviews.${index}.role`} label="Role" />
                                  </FormRow>
                                  <FormTextarea name={`testimonials.reviews.${index}.quote`} label="Quote" rows={3} />
                                  <FormRow>
                                    <FormInput name={`testimonials.reviews.${index}.highlight`} label="Highlight" />
                                    <FormInput name={`testimonials.reviews.${index}.stats`} label="Stats Badge" />
                                  </FormRow>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => push({ id: `testimonial-${Date.now()}`, name: '', role: '', avatar: '', quote: '', highlight: '', stats: '' })}
                                className="flex items-center gap-2 w-full px-4 py-2 text-xs font-bold uppercase bg-[#0c0f0d] border border-dashed border-neutral-700 text-neutral-400 hover:border-[var(--primary)] transition-all"
                              >
                                <Plus className="w-4 h-4" />
                                Add Review
                              </button>
                            </div>
                          )}
                        </FieldArray>
                      </div>
                    </Section>

                    {/* Why Choose Section */}
                    <Section
                      icon={<Star className="w-5 h-5" />}
                      title="Why Choose Us"
                      isExpanded={expandedSections.whyChoose}
                      onToggle={() => toggleSection('whyChoose')}
                    >
                      <FormRow>
                        <FormInput name="whyChoose.tag" label="Section Tag" />
                        <FormInput name="whyChoose.heading" label="Heading" />
                      </FormRow>
                      <FormTextarea name="whyChoose.subheading" label="Subheading" rows={2} />
                      <FormImageUpload name="whyChoose.coachImage" label="Coach Image" />
                      <FormRow>
                        <FormInput name="whyChoose.trackRecordCount" label="Track Record Count" />
                        <FormInput name="whyChoose.trackRecordLabel" label="Track Record Label" />
                      </FormRow>
                      <FormTextarea name="whyChoose.trackRecordDescription" label="Track Record Description" rows={2} />
                      
                      <div className="space-y-4 mt-4">
                        <label className="text-sm font-semibold text-neutral-200">The 4 Pillars</label>
                        <FieldArray name="whyChoose.pillars">
                          {({ push, remove }) => (
                            <div className="space-y-4">
                              {values.whyChoose.pillars.map((pillar, index) => (
                                <div key={pillar.id} className="p-4 bg-[#0c0f0d] border border-neutral-800 space-y-3">
                                  <div className="flex justify-between">
                                    <span className="text-xs font-mono text-[var(--primary)]">Pillar {pillar.number}</span>
                                    <button type="button" onClick={() => remove(index)} className="p-1.5 bg-red-900/20 border border-red-800 text-red-300">
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                  <FormRow>
                                    <FormInput name={`whyChoose.pillars.${index}.number`} label="Number" placeholder="01" />
                                    <FormInput name={`whyChoose.pillars.${index}.title`} label="Title" />
                                  </FormRow>
                                  <FormTextarea name={`whyChoose.pillars.${index}.description`} label="Description" rows={3} />
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => push({ id: `pillar-${Date.now()}`, number: '', title: '', description: '' })}
                                className="flex items-center gap-2 w-full px-4 py-2 text-xs font-bold uppercase bg-[#0c0f0d] border border-dashed border-neutral-700 text-neutral-400 hover:border-[var(--primary)] transition-all"
                              >
                                <Plus className="w-4 h-4" />
                                Add Pillar
                              </button>
                            </div>
                          )}
                        </FieldArray>
                      </div>
                    </Section>

                    {/* Features Section */}
                    <Section
                      icon={<Sparkles className="w-5 h-5" />}
                      title="Features"
                      isExpanded={expandedSections.features}
                      onToggle={() => toggleSection('features')}
                    >
                      <FormRow>
                        <FormInput name="features.tag" label="Section Tag" />
                        <FormInput name="features.heading" label="Heading" />
                      </FormRow>
                      
                      <div className="space-y-4 mt-4">
                        <FieldArray name="features.items">
                          {({ push, remove }) => (
                            <div className="space-y-4">
                              {values.features.items.map((item, index) => (
                                <div key={item.id} className="p-4 bg-[#0c0f0d] border border-neutral-800 space-y-3">
                                  <div className="flex justify-between">
                                    <span className="text-xs font-mono text-[var(--primary)]">Feature #{index + 1}</span>
                                    <button type="button" onClick={() => remove(index)} className="p-1.5 bg-red-900/20 border border-red-800 text-red-300">
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                  <FormInput name={`features.items.${index}.title`} label="Title" />
                                  <FormTextarea name={`features.items.${index}.description`} label="Description" rows={3} />
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => push({ id: `feature-${Date.now()}`, icon: '', title: '', description: '' })}
                                className="flex items-center gap-2 w-full px-4 py-2 text-xs font-bold uppercase bg-[#0c0f0d] border border-dashed border-neutral-700 text-neutral-400 hover:border-[var(--primary)] transition-all"
                              >
                                <Plus className="w-4 h-4" />
                                Add Feature
                              </button>
                            </div>
                          )}
                        </FieldArray>
                      </div>
                    </Section>

                    {/* Comparison Section */}
                    <Section
                      icon={<Scale className="w-5 h-5" />}
                      title="Comparison Table"
                      isExpanded={expandedSections.comparison}
                      onToggle={() => toggleSection('comparison')}
                    >
                      <FormRow>
                        <FormInput name="comparison.tag" label="Section Tag" />
                        <FormInput name="comparison.heading" label="Heading" />
                      </FormRow>
                      <FormTextarea name="comparison.subheading" label="Subheading" rows={2} />
                      
                      <div className="space-y-4 mt-4">
                        <FieldArray name="comparison.table">
                          {({ push, remove }) => (
                            <div className="space-y-4">
                              {values.comparison.table.map((item, index) => (
                                <div key={item.id} className="p-4 bg-[#0c0f0d] border border-neutral-800 space-y-3">
                                  <div className="flex justify-between">
                                    <span className="text-xs font-mono text-[var(--primary)]">Row #{index + 1}</span>
                                    <button type="button" onClick={() => remove(index)} className="p-1.5 bg-red-900/20 border border-red-800 text-red-300">
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                  <FormInput name={`comparison.table.${index}.criteria`} label="Criteria" />
                                  <FormTextarea name={`comparison.table.${index}.drAssem`} label="Your Method" rows={2} />
                                  <FormTextarea name={`comparison.table.${index}.others`} label="Competition" rows={2} />
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => push({ id: `comparison-${Date.now()}`, criteria: '', drAssem: '', others: '' })}
                                className="flex items-center gap-2 w-full px-4 py-2 text-xs font-bold uppercase bg-[#0c0f0d] border border-dashed border-neutral-700 text-neutral-400 hover:border-[var(--primary)] transition-all"
                              >
                                <Plus className="w-4 h-4" />
                                Add Row
                              </button>
                            </div>
                          )}
                        </FieldArray>
                      </div>
                    </Section>

                    {/* Packages Section */}
                    <Section
                      icon={<DollarSign className="w-5 h-5" />}
                      title="Packages & Pricing"
                      isExpanded={expandedSections.packages}
                      onToggle={() => toggleSection('packages')}
                    >
                      <FormRow>
                        <FormInput name="packages.tag" label="Section Tag" />
                        <FormInput name="packages.heading" label="Heading" />
                      </FormRow>
                      
                      <div className="space-y-4 mt-4">
                        <FieldArray name="packages.items">
                          {({ push, remove }) => (
                            <div className="space-y-4">
                              {values.packages.items.map((pkg, index) => (
                                <div key={pkg.id} className="p-4 bg-[#0c0f0d] border border-neutral-800 space-y-3">
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs font-mono text-[var(--primary)]">{pkg.name || `Package #${index + 1}`}</span>
                                    <button type="button" onClick={() => remove(index)} className="p-1.5 bg-red-900/20 border border-red-800 text-red-300">
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                  <FormRow>
                                    <FormInput name={`packages.items.${index}.name`} label="Package Name" />
                                    <FormInput name={`packages.items.${index}.priceEGP`} type="number" label="Price (EGP)" />
                                  </FormRow>
                                  <FormTextarea name={`packages.items.${index}.description`} label="Description" rows={2} />
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      id={`packages.items.${index}.popular`}
                                      checked={pkg.popular}
                                      onChange={(e) => setFieldValue(`packages.items.${index}.popular`, e.target.checked)}
                                      className="w-4 h-4"
                                    />
                                    <label htmlFor={`packages.items.${index}.popular`} className="text-sm text-neutral-300">
                                      Mark as Popular
                                    </label>
                                  </div>
                                  {pkg.note !== undefined && (
                                    <FormInput name={`packages.items.${index}.note`} label="Note (optional)" />
                                  )}
                                  <FormArrayField name={`packages.items.${index}.features`} label="Features" placeholder="Feature..." />
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => push({ id: `package-${Date.now()}`, name: '', priceEGP: 0, description: '', popular: false, features: [] })}
                                className="flex items-center gap-2 w-full px-4 py-2 text-xs font-bold uppercase bg-[#0c0f0d] border border-dashed border-neutral-700 text-neutral-400 hover:border-[var(--primary)] transition-all"
                              >
                                <Plus className="w-4 h-4" />
                                Add Package
                              </button>
                            </div>
                          )}
                        </FieldArray>
                      </div>
                    </Section>

                    {/* How It Works Section */}
                    <Section
                      icon={<ListOrdered className="w-5 h-5" />}
                      title="How It Works"
                      isExpanded={expandedSections.howItWorks}
                      onToggle={() => toggleSection('howItWorks')}
                    >
                      <FormRow>
                        <FormInput name="howItWorks.tag" label="Section Tag" />
                        <FormInput name="howItWorks.heading" label="Heading" />
                      </FormRow>
                      
                      <div className="space-y-4 mt-4">
                        <FieldArray name="howItWorks.steps">
                          {({ push, remove }) => (
                            <div className="space-y-4">
                              {values.howItWorks.steps.map((step, index) => (
                                <div key={step.id} className="p-4 bg-[#0c0f0d] border border-neutral-800 space-y-3">
                                  <div className="flex justify-between">
                                    <span className="text-xs font-mono text-[var(--primary)]">Step {step.step}</span>
                                    <button type="button" onClick={() => remove(index)} className="p-1.5 bg-red-900/20 border border-red-800 text-red-300">
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                  <FormRow>
                                    <FormInput name={`howItWorks.steps.${index}.step`} label="Step Number" placeholder="01" />
                                    <FormInput name={`howItWorks.steps.${index}.title`} label="Title" />
                                  </FormRow>
                                  <FormTextarea name={`howItWorks.steps.${index}.description`} label="Description" rows={2} />
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => push({ id: `step-${Date.now()}`, step: '', title: '', description: '' })}
                                className="flex items-center gap-2 w-full px-4 py-2 text-xs font-bold uppercase bg-[#0c0f0d] border border-dashed border-neutral-700 text-neutral-400 hover:border-[var(--primary)] transition-all"
                              >
                                <Plus className="w-4 h-4" />
                                Add Step
                              </button>
                            </div>
                          )}
                        </FieldArray>
                      </div>
                    </Section>

                    {/* Inspiration Banner */}
                    <Section
                      icon={<Target className="w-5 h-5" />}
                      title="Inspiration Banner"
                      isExpanded={expandedSections.inspirationBanner}
                      onToggle={() => toggleSection('inspirationBanner')}
                    >
                      <FormRow>
                        <FormInput name="inspirationBanner.title" label="Title" />
                        <FormInput name="inspirationBanner.ctaText" label="CTA Text" />
                      </FormRow>
                      <FormTextarea name="inspirationBanner.quote" label="Quote" rows={4} />
                      <FormArrayField name="inspirationBanner.pills" label="Pills/Tags" placeholder="Tag..." />
                    </Section>

                    {/* FAQs Section */}
                    <Section
                      icon={<HelpCircle className="w-5 h-5" />}
                      title="FAQs"
                      isExpanded={expandedSections.faqs}
                      onToggle={() => toggleSection('faqs')}
                    >
                      <FormRow>
                        <FormInput name="faqs.tag" label="Section Tag" />
                        <FormInput name="faqs.heading" label="Heading" />
                      </FormRow>
                      
                      <div className="space-y-4 mt-4">
                        <FieldArray name="faqs.items">
                          {({ push, remove }) => (
                            <div className="space-y-4">
                              {values.faqs.items.map((faq, index) => (
                                <div key={faq.id} className="p-4 bg-[#0c0f0d] border border-neutral-800 space-y-3">
                                  <div className="flex justify-between">
                                    <span className="text-xs font-mono text-[var(--primary)]">FAQ #{index + 1}</span>
                                    <button type="button" onClick={() => remove(index)} className="p-1.5 bg-red-900/20 border border-red-800 text-red-300">
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                  <FormInput name={`faqs.items.${index}.question`} label="Question" />
                                  <FormTextarea name={`faqs.items.${index}.answer`} label="Answer" rows={3} />
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => push({ id: `faq-${Date.now()}`, question: '', answer: '' })}
                                className="flex items-center gap-2 w-full px-4 py-2 text-xs font-bold uppercase bg-[#0c0f0d] border border-dashed border-neutral-700 text-neutral-400 hover:border-[var(--primary)] transition-all"
                              >
                                <Plus className="w-4 h-4" />
                                Add FAQ
                              </button>
                            </div>
                          )}
                        </FieldArray>
                      </div>
                    </Section>

                    {/* Footer Section */}
                    <Section
                      icon={<Layout className="w-5 h-5" />}
                      title="Footer"
                      isExpanded={expandedSections.footer}
                      onToggle={() => toggleSection('footer')}
                    >
                      <FormInput name="footer.copyrightText" label="Copyright Text" />
                      <FormRow>
                        <FormInput name="footer.privacyLink" label="Privacy Link" placeholder="/privacy" />
                        <FormInput name="footer.termsLink" label="Terms Link" placeholder="/terms" />
                      </FormRow>
                      <FormRow>
                        <FormInput name="footer.socialLinks.instagram" label="Instagram URL" />
                        <FormInput name="footer.socialLinks.facebook" label="Facebook URL" />
                      </FormRow>
                      <FormRow columns={1}>
                        <FormInput name="footer.socialLinks.whatsapp" label="WhatsApp Link" />
                      </FormRow>
                    </Section>

                  </div>
                </div>

                {/* Right: Live Preview */}
                <div className="w-1/2 bg-neutral-900 overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-neutral-800 bg-[#0c0f0d]">
                    <h2 className="text-lg font-black text-neutral-200 flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      LIVE PREVIEW
                    </h2>
                    <p className="text-xs text-neutral-400 mt-1">Updates automatically as you type</p>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <iframe
                      key={debouncedData ? JSON.stringify(debouncedData.theme) : 'loading'}
                      src="/"
                      className="w-full h-full border-0"
                      title="Live Preview"
                      style={{
                        transform: 'scale(0.75)',
                        transformOrigin: 'top left',
                        width: '133.33%',
                        height: '133.33%'
                      }}
                    />
                  </div>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>

      {/* Inject Dynamic CSS Variables */}
      {data && (
        <style jsx global>{`
          :root {
            --admin-primary: ${data.theme.primaryColor};
            --admin-primary-hover: ${data.theme.primaryColorHover};
            --admin-bg: ${data.theme.backgroundColor};
            --admin-surface: ${data.theme.surfaceColor};
            --admin-border: ${data.theme.borderColor};
            --admin-text-primary: ${data.theme.textPrimary};
            --admin-text-secondary: ${data.theme.textSecondary};
            --admin-input-bg: #0c0f0d;
          }
        `}</style>
      )}
    </div>
  );
}

// Collapsible Section Component
interface SectionProps {
  icon: React.ReactNode;
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ icon, title, isExpanded, onToggle, children }) => {
  return (
    <div className="border border-neutral-800 bg-[#0c0f0d]">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between
          text-left font-bold text-neutral-200 uppercase text-sm tracking-wide
          hover:bg-neutral-900/50 transition-colors"
      >
        <span className="flex items-center gap-2">
          {icon}
          {title}
        </span>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-[var(--primary)]" />
        ) : (
          <ChevronDown className="w-5 h-5 text-neutral-400" />
        )}
      </button>
      
      {isExpanded && (
        <div className="px-4 py-4 space-y-4 border-t border-neutral-800">
          {children}
        </div>
      )}
    </div>
  );
};
