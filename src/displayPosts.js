import { pb } from './pocketbase';
import { Auth } from './Auth';
import './App.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import React from 'react';

export default function PostDisplay() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const lastElementRef = useRef();
    const [index, setIndex] = useState(2);
    const [ttlPgs, setTtlPgs] = useState(undefined)

    useEffect(() => {
        async function fetchData() {
            try {
                const resultList = await pb.collection('posts').getList(1, 10, {
                    sort: '-created',
                });
                setData(resultList.items || []);
                console.log("resultList: ", resultList)
                console.log("Please work: ", resultList.totalPages)
                setTtlPgs(resultList.totalPages)
                console.log(ttlPgs)
            } catch (error) {
                console.log("Error", error);
            }
        }

        fetchData();
    }, []); // Make sure to provide an empty dependency array to run this effect only once

    const fetchMore = useCallback(async () => {
        console.log(ttlPgs)
        setLoading(true);
        try {
            const resultList = await pb.collection('posts').getList(index, 10, {
                sort: '-created',
            });
            console.log(resultList)
            setData(data.concat(resultList.items));
            console.log(index)
            setIndex(index + 1);
            console.log(index)
        } catch (error) {
            console.log("Error", error);
        } finally {
            setLoading(false);
        }
    }, [index, data, ttlPgs]);

    useEffect(() => {
        if (lastElementRef.current && index - 1 != ttlPgs) {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    console.log("Intersecting");
                    console.log(data);
                    fetchMore();
                }
            }, {
                root: document.getElementById('scroll-container'), // Use the "scroll-container" div as the root
                rootMargin: '0px', // No margin
                threshold: 0.1, // Trigger when 10% of the last element is visible
            });

            observer.observe(lastElementRef.current);

            return () => {
                observer.disconnect();
            };
        }
    }, [data, fetchMore, index, ttlPgs]); // Watch for changes in the "data" array and the memoized fetchMore function

    const getURL = async (postID) => {
        try {
            const url = await pb.files.getUrl(postID); // Replace 'postID' with the actual ID of your image file
            return url;
        } catch (error) {
            console.error('Error fetching image URL:', error);
            return null;
        }
    }

    return (
        <div id="scroll-container" className='scroll'>
            {data ? (
                data.map((item, index) => (
                    <div key={item.id}>
                        {index === data.length - 1 ? (
                            <h1 ref={lastElementRef}>{item.title}</h1>
                        ) : (
                            
                            <img src={pb.files.getUrl(item, item.image)} alt="images"/>
                        )}
                    </div>
                ))
            ) : (
                <p>No data available.</p>
            )}
            {loading && <p>Loading...</p>}
        </div>
    );
}
