import { useParams } from 'react-router-dom';
import GiftShop from './storefronts1/GiftShop';
import BookStore from './storefronts1/BookStore';
import TechShop from './storefronts1/TechShop';

export default function Lab7Sub1({ variantIdProp }: { variantIdProp?: string }) {
  const params = useParams();
  const variantId = variantIdProp || params.variantId || 'a';
  
  if (variantId === 'b') {
    return <BookStore />;
  } else if (variantId === 'c') {
    return <TechShop />;
  }
  
  return <GiftShop />;
}
