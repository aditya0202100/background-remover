import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Float "mo:core/Float";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Types "../types/reviews";

module {
  public type Review = Types.Review;

  public func submit(
    reviews : List.List<Review>,
    nextId : Nat,
    name : Text,
    rating : Nat,
    comment : Text,
  ) {
    if (rating < 1 or rating > 5) {
      Runtime.trap("Rating must be between 1 and 5");
    };
    reviews.add({
      id = nextId;
      name;
      rating;
      comment;
      timestamp = Time.now();
    });
  };

  public func getAll(reviews : List.List<Review>) : [Review] {
    let arr = reviews.toArray();
    arr.reverse();
  };

  public func deleteById(
    reviews : List.List<Review>,
    id : Nat,
    password : Text,
  ) : Bool {
    if (password != "528953") {
      return false;
    };
    let sizeBefore = reviews.size();
    let kept = reviews.filter(func(r) { r.id != id });
    reviews.clear();
    reviews.append(kept);
    reviews.size() < sizeBefore;
  };

  public func analytics(reviews : List.List<Review>) : Types.Analytics {
    let total = reviews.size();
    if (total == 0) {
      return {
        averageRating = 0.0;
        totalCount = 0;
        starCounts = [0, 0, 0, 0, 0];
      };
    };

    let counts = [var 0, 0, 0, 0, 0];
    var sum : Nat = 0;
    reviews.forEach(func(r) {
      if (r.rating >= 1 and r.rating <= 5) {
        counts[r.rating - 1] += 1;
        sum += r.rating;
      };
    });

    let avg = sum.toFloat() / total.toFloat();
    {
      averageRating = avg;
      totalCount = total;
      starCounts = Array.tabulate(5, func i = counts[i]);
    };
  };
};
