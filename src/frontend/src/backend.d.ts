import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Analytics {
    starCounts: Array<bigint>;
    totalCount: bigint;
    averageRating: number;
}
export interface Review {
    id: bigint;
    name: string;
    comment: string;
    timestamp: bigint;
    rating: bigint;
}
export interface backendInterface {
    deleteReview(id: bigint, password: string): Promise<boolean>;
    getAnalytics(): Promise<Analytics>;
    getReviews(): Promise<Array<Review>>;
    submitReview(name: string, rating: bigint, comment: string): Promise<void>;
}
