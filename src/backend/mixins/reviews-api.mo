import List "mo:core/List";
import ReviewLib "../lib/reviews";
import Types "../types/reviews";

mixin (reviews : List.List<Types.Review>, nextReviewId : { var value : Nat }) {
  public func submitReview(name : Text, rating : Nat, comment : Text) : async () {
    ReviewLib.submit(reviews, nextReviewId.value, name, rating, comment);
    nextReviewId.value += 1;
  };

  public func deleteReview(id : Nat, password : Text) : async Bool {
    ReviewLib.deleteById(reviews, id, password);
  };

  public query func getReviews() : async [Types.Review] {
    ReviewLib.getAll(reviews);
  };

  public query func getAnalytics() : async Types.Analytics {
    ReviewLib.analytics(reviews);
  };
};
