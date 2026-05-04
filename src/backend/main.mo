import List "mo:core/List";
import Types "types/reviews";
import ReviewsApi "mixins/reviews-api";
import Migration "migrations";


persistent actor {
  stable let reviews = List.empty<Types.Review>();
  stable var nextReviewId : Nat = 0;
  let reviewIdBox = { var value = nextReviewId };
  include ReviewsApi(reviews, reviewIdBox);
};

