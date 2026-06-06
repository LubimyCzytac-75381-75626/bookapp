package pl.vistula.bookapp.jpa.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import pl.vistula.bookapp.jpa.model.BookReview;

public interface BookReviewRepository extends JpaRepository<BookReview, Long> {
    List<BookReview> findByBookId(Long bookId);
    void deleteByBookId(Long bookId);
}
