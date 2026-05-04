module {
  public type Review = {
    id : Nat;
    name : Text;
    rating : Nat;
    comment : Text;
    timestamp : Int;
  };

  public type Analytics = {
    averageRating : Float;
    totalCount : Nat;
    starCounts : [Nat];
  };
};
