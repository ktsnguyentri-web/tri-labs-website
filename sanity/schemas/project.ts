// @ts-nocheck
import { defineType, defineField } from 'sanity';

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Project Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers show up first in the grid.',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Architecture', value: 'Architecture' },
          { title: 'Interior', value: 'Interior' },
          { title: 'Design', value: 'Design' },
        ],
      },
    }),
    defineField({
      name: 'span',
      title: 'Grid Span',
      type: 'string',
      description: 'Tailwind CSS class for bento box layout (e.g., md:col-span-2)',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    
    // ---------------------------------------------------------------------------
    // Project Metadata
    // ---------------------------------------------------------------------------
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'completionYear',
      title: 'Completion Year',
      type: 'string',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'scope',
      title: 'Scope',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'office',
      title: 'Office',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
    }),
    defineField({
      name: 'architect',
      title: 'Architect',
      type: 'string',
    }),

    // ---------------------------------------------------------------------------
    // Size Properties
    // ---------------------------------------------------------------------------
    defineField({
      name: 'siteArea',
      title: 'Site Area',
      type: 'string',
      group: 'size',
    }),
    defineField({
      name: 'buildingHeight',
      title: 'Building Height',
      type: 'string',
      group: 'size',
    }),
    defineField({
      name: 'stories',
      title: 'Stories',
      type: 'string',
      group: 'size',
    }),
    defineField({
      name: 'grossArea',
      title: 'Gross Area',
      type: 'string',
      group: 'size',
    }),

    // ---------------------------------------------------------------------------
    // Narrative
    // ---------------------------------------------------------------------------
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'collaborators',
      title: 'Collaborators',
      type: 'array',
      of: [{ type: 'string' }],
    }),

    // ---------------------------------------------------------------------------
    // Galleries
    // ---------------------------------------------------------------------------
    defineField({
      name: 'architectureGallery',
      title: 'Architecture Gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'interiorGallery',
      title: 'Interior Gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'drawingGallery',
      title: 'Drawing & Diagram Gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
  ],
  groups: [
    { name: 'size', title: 'Size Specifications' },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'heroImage',
    },
  },
});
