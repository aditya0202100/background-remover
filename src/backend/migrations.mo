// Migration from v1 (Review without name) to v2 (Review with name)
import List "mo:core/List";
import Types "types/reviews";

module {
  // Old Review type before the `name` field was added
  public type ReviewV1 = {
    id : Nat;
    rating : Nat;
    comment : Text;
    timestamp : Int;
  };

  public func migrate(
    old : {
      reviews : List.List<ReviewV1>;
      nextReviewId : Nat;
    }
  ) : {
    reviews : List.List<Types.Review>;
    nextReviewId : Nat;
  } {
    let newList = List.empty<Types.Review>();
    let arr = old.reviews.toArray();
    for (r in arr.vals()) {
      newList.add({
        id = r.id;
        name = "Anonymous";
        rating = r.rating;
        comment = r.comment;
        timestamp = r.timestamp;
      });
    };
    { reviews = newList; nextReviewId = old.nextReviewId };
  };
};
