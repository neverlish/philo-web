import { notFound } from 'next/navigation'
import { ExplorerPage, explorerMetadata } from '@/components/explorer/explorer-page'
import { EXPLORER_SLUGS, isExplorerSlug } from '@/lib/explorer/pages'

type Props = { params: Promise<{ slug: string }> }
export const dynamicParams = false
export function generateStaticParams() { return EXPLORER_SLUGS.filter(slug => slug !== 'index').map(slug => ({ slug })) }
export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  if (!isExplorerSlug(slug) || slug === 'index') notFound()
  return explorerMetadata(slug)
}
export default async function Page({ params }: Props) {
  const { slug } = await params
  if (!isExplorerSlug(slug) || slug === 'index') notFound()
  return <ExplorerPage slug={slug} />
}
