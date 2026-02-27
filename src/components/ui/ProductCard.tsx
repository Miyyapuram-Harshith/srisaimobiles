import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/db';

export default function ProductCard({ product }: { product: Product }) {
    return (
        <Link href={`/products/${product.id}`} className="group block h-full">
            <div className="bg-apple-card rounded-3xl p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.05)] border border-transparent hover:border-apple-border/50 flex flex-col h-full relative overflow-hidden">


                {/* New/Condition Badge */}
                <div className="mb-4 text-xs font-semibold text-apple-blue uppercase tracking-wider">
                    {product.condition}
                </div>

                {/* Image Placeholder area */}
                <div className="relative aspect-square mb-8 bg-gradient-to-b from-apple-bg to-transparent rounded-2xl overflow-hidden flex items-center justify-center p-4">
                    {product.images && product.images[0] ? (
                        <img
                            src={product.images[0]}
                            alt={product.title}
                            className="object-contain w-3/4 h-3/4 mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="text-apple-text-secondary text-sm">No Image</div>
                    )}
                </div>

                {/* Details */}
                <div className="mt-auto text-center flex flex-col items-center">
                    <h3 className="text-lg font-bold text-apple-text mb-2 tracking-tight group-hover:text-apple-blue transition-colors">{product.title}</h3>
                    <p className="text-sm text-apple-text-secondary mb-5 line-clamp-2 leading-relaxed">{product.description}</p>
                    <div className="text-lg font-medium text-apple-black mt-auto">
                        ₹{product.price.toLocaleString('en-IN')}
                    </div>
                </div>

            </div>
        </Link>
    );
}
