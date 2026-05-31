package pl.vistula.bookapp.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;
import pl.vistula.bookapp.jpa.model.Book;
import pl.vistula.bookapp.jpa.model.BookReview;
import pl.vistula.bookapp.jpa.repository.BookReviewRepository;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@Slf4j
@RequestMapping("/book-review")
public class BookReviewController {

    @Autowired
    private BookReviewRepository bookReviewRepository;

    @GetMapping("/")
    List<BookReview> list(@RequestParam Long bookId) {
        log.info("Getting list of books for author with id: {}", bookId);
        return bookReviewRepository.findByBookId(bookId);
    }
    @PostMapping("/save")
    public BookReview save(@RequestBody BookReview bookReview) {
        log.info("Saving book review: {}", bookReview);

        return bookReviewRepository.save(bookReview);
    }

    @GetMapping("/{id}")
    ResponseEntity<BookReview> get(@PathVariable Long id) {
        log.info("Getting book review with  id: {}", id);
        return bookReviewRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("Deleting book review with id: {}", id);
        if (bookReviewRepository.existsById(id)) {
            bookReviewRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }

    }
  }
