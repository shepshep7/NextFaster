"use client";
import { Link } from "@/components/ui/link";
import NextImage from "next/image";
import { getImageProps } from "next/image";
import { Product } from "@/db/schema";
import { useEffect } from "react";

export function getProductLinkImageProps(
  imageUrl: string,
  productName: string,
) {
  return getImageProps({
    width: 160,
    height: 120,
    quality: 65,
    src: imageUrl,
    alt: `A small picture of ${productName}`,
  });
}

export function ProductLink(props: {
  imageUrl?: string | null;
  category_slug: string;
  subcategory_slug: string;
  loading: "eager" | "lazy";
  product: Product;
}) {
  const { category_slug, subcategory_slug, product, imageUrl } = props;

  // Update prefetch dimensions to match new card size
  const prefetchProps = getImageProps({
    height: 240,
    quality: 80,
    width: 320,
    src: imageUrl ?? "/placeholder.svg?height=120&width=160",
    alt: `A small picture of ${product.name}`,
  });
  useEffect(() => {
    try {
      const iprops = prefetchProps.props;
      const img = new Image();
      // Don't interfer with important requests
      img.fetchPriority = "low";
      // Don't block the main thread with prefetch images
      img.decoding = "async";
      // Order is important here, sizes must be set before srcset, srcset must be set before src
      if (iprops.sizes) img.sizes = iprops.sizes;
      if (iprops.srcSet) img.srcset = iprops.srcSet;
      if (iprops.src) img.src = iprops.src;
    } catch (e) {
      console.error("failed to preload", prefetchProps.props.src, e);
    }
  }, [prefetchProps]);
  return (
    <Link
      prefetch={true}
      className="group flex h-[120px] w-full flex-row border hover:bg-gray-100 sm:w-[400px]"
      href={`/products/${category_slug}/${subcategory_slug}/${product.slug}`}
    >
      <div className="relative flex h-[118px] w-[160px] flex-shrink-0 items-center justify-center bg-white p-3">
        <NextImage
          loading={props.loading}
          decoding="sync"
          src={imageUrl ?? "/placeholder.svg?height=120&width=160"}
          alt={`A small picture of ${product.name}`}
          width={160}
          height={120}
          quality={65}
          className="h-auto max-h-[112px] w-auto max-w-[154px] object-contain"
        />
      </div>
      <div className="flex flex-grow flex-col justify-between p-4">
        <div>
          <div className="text-sm font-medium text-gray-700 group-hover:underline">
            {product.name}
          </div>
          <p className="mt-1 line-clamp-2 text-xs text-gray-600">
            {product.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
