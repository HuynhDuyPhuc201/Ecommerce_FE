import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { lazy, Suspense, memo } from 'react';

import Navbar from '~/components/Navbar';
import { Col, Pagination, Row, Skeleton } from 'antd';
import { useParams, useSearchParams } from 'react-router-dom';
import { productService } from '~/services/product.service';
import { useQuery } from '@tanstack/react-query';
import HomeSlider from '~/components/HomeSlider';
import HelmetComponent from '~/components/Helmet';
import SortDropdown from '~/components/SortDropdown ';
const LazyProductCard = lazy(() => import('~/components/ProductCard'));

const Index = () => {
    const { id } = useParams();

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [searchParams, setSearchParams] = useSearchParams();
    const page = useMemo(() => searchParams.get('page') || 1, [searchParams]);
    const [currentPage, setCurrentPage] = useState(page);
    const [sort, setSort] = useState(searchParams.get('sort') || 'asc');
    const rating = useMemo(() => searchParams.get('rating') || '', [searchParams]);
    const price = useMemo(() => searchParams.get('price') || 0, [searchParams]);
    const name = useMemo(() => searchParams.get('q') || '', [searchParams]);

    // 🛠 Cập nhật rating
    const updateRating = useCallback(
        (newRating) => {
            setSearchParams((prev) => {
                const params = new URLSearchParams(prev);
                newRating ? params.set('rating', newRating) : params.delete('rating');
                return params;
            });
        },
        [setSearchParams],
    );

    // 🛠 Cập nhật price
    const updatePrice = useCallback(
        (newPrice) => {
            setSearchParams((prev) => {
                const params = new URLSearchParams(prev);
                newPrice ? params.set('price', newPrice) : params.delete('price');
                return params;
            });
        },
        [setSearchParams],
    );

    // 🛠 useEffect tối ưu hóa searchParams
    useEffect(() => {
        setSearchParams((prev) => {
            const params = new URLSearchParams(prev);
            if (rating) params.set('rating', rating);
            if (price) params.set('price', price);
            if (name) params.set('q', name);
            return params;
        });
    }, [rating, price, name]);

    // 🛠 useMemo tối ưu query
    const query = useMemo(() => {
        return `?page=${currentPage}${sort ? `&sort=${sort}` : ''}${
            id && !isNaN(Number(id)) && Number(id) > 0 ? `&categories=${id}` : ''
        }${searchParams ? `&${searchParams.toString()}` : ''}`;
    }, [currentPage, sort, id, searchParams]);

    // 🛠 Fetch sản phẩm với react-query
    const { data, isLoading } = useQuery({
        queryKey: ['products', sort, rating, price, id, searchParams, currentPage, name],
        queryFn: async () => await productService.getAll(query),
        refetchOnWindowFocus: false, // Tắt refetch khi tab focus lại
        refetchOnReconnect: false, // Tắt refetch khi mạng có lại
        staleTime: 5 * 60 * 1000,
        cacheTime: 1000 * 60 * 30,
    });

    // 🛠 Thay đổi cách sắp xếp
    const handleSelectChange = useCallback((e) => {
        setSort(e.target.value);
    }, []);

    const dataProduct = data?.data;

    // 🛠 Thay đổi trang Pagination
    const onShowSizeChange = (page) => {
        setCurrentPage(page);
    };

    // 🛠 Cập nhật kích thước cửa sổ (windowWidth)
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <HelmetComponent title="Trang chủ" />
            <div className="py-0 container my-20">
                <HomeSlider />
                {windowWidth > 500 && <SortDropdown sort={sort} onChange={handleSelectChange} />}

                <Row gutter={[12, 12]} style={{ rowGap: '16px' }}>
                    <Col md={6}>
                        <Navbar ratingObj={{ updateRating, rating }} priceObj={{ price, updatePrice }} />
                    </Col>

                    {windowWidth < 500 && (
                        <Col sm={24} xs={24} md={24}>
                            <SortDropdown sort={sort} onChange={handleSelectChange} />
                        </Col>
                    )}
  
                    <Col xs={24} sm={18} md={18}>
                        <Row gutter={[12, 12]} style={{ rowGap: '16px', marginTop: '20px' }}>
                            {isLoading
                                ? Array.from({ length: 8 }).map((_, i) => (
                                      <Col lg={6} md={8} sm={12} xs={12} key={i}>
                                          <Skeleton active style={{ height: '200px' }} />
                                      </Col>
                                  ))
                                : dataProduct?.map((item, i) => (
                                      <Col lg={6} md={8} sm={12} xs={12} key={i}>
                                          <Suspense fallback={<Skeleton active style={{ height: '200px' }} />}>
                                              <LazyProductCard item={item} heartIcon/>
                                          </Suspense>
                                      </Col>
                                  ))}
                        </Row>

                        {dataProduct?.length === 0 && (
                            <div className="text-center">
                                <p className="text-[17px] font-bold">Không có sản phẩm nào</p>
                            </div>
                        )}
                    </Col>
                </Row>

                <div className="flex justify-end">
                    <Pagination
                        style={{ padding: '16px', display: 'flex', justifyContent: 'center' }}
                        onChange={onShowSizeChange}
                        total={data?.total || 0}
                        pageSize={8}
                        current={currentPage}
                    />
                </div>
            </div>
        </>
    );
};

export default memo(Index);
